import React, {Component} from 'react';
import {connect} from "react-redux";
import { bindActionCreators } from 'redux';
import SelectComponent from '../../HelpersBlocks/SelectComponent/SelectComponent';
import MenuItem from '@material-ui/core/MenuItem';
import TableLoader from '../../TableLoader/TableLoader';
import Pagination from '../../Pagination/Pagination';
import {getError} from "../../../helpers/functions";
import {Link} from 'react-router-dom';
import moment from 'moment';

import {getFinancialTransactions, getClientsList, getChannelsList} from "../../../actions/financesActions";

import "./Transactions.scss";

class Transactions extends Component {
    state = {
        loading: true,
        empty: false,
        client: '',
        channel: '',
        activePage: 1
    };

    componentDidMount() {
        const {getClientsList, getChannelsList, finances:{clients_list, channels_list}} = this.props;
        const {client, channel, activePage} = this.state;
        if(!clients_list.length > 0 || !channels_list.length > 0){
            getClientsList();
            getChannelsList();
        }
        this.doRequest(client, channel, activePage);
    }

    componentWillMount() {
        this.props.finances.financial_transactions = {};
        this.props.finances.transactions_error = [];
    }

    doRequest = (client, channel, page) => {
        const {getFinancialTransactions} = this.props;

        let params = [];

        if(client !== '')  params.push(`client=${client}`);
        if(channel !== '')  params.push(`channel=${channel}`);
        params.push(`page=${page}`);
        params.push(`page_size=20`);

        this.setState({client, channel, activePage: page, loading: true, empty: false});
        getFinancialTransactions(params).then((res)=>{
            if(res.payload && res.payload.status && res.payload.status === 200){
                this.setState({loading: false});
                if(res.payload.data.results.length === 0){
                    this.setState({empty: true});
                }
            }
            else {
                this.setState({loading: false});
            }
        });
    };

    changeClient = ({target:{value}}) => {
        const {finances:{channels_list}} = this.props;
        const {client, channel} = this.state;
        if(client === value) {
            return null;
        }
        else if(channel !== '' && value !== '' && !channels_list.filter(el=>el.id === channel && el.client_id === value).length > 0){
            this.doRequest(value, '', 1);
        }
        else {
            this.doRequest(value, channel, 1);
        }
    };

    changeChannel = event => {
        const {client} = this.state;
        this.doRequest(client, event.target.value, 1);
    };

    changePage = (pageNumber) => {
        const {client, channel} = this.state;
        this.doRequest(client, channel, pageNumber);
    };

    render(){
        const {finances:{financial_transactions, clients_list, channels_list, transactions_error}} = this.props;
        const {loading, empty, client, channel, activePage} = this.state;
        let channel_items = channels_list;
        if(client !== '') {
            channel_items = channels_list.filter(el=>el.client_id === client);
        }
        return (
            <div className="transactions_page">
                {loading ? <TableLoader/> : null}
                <div className="table_options_container">
                    <div className="table_filters">
                        <SelectComponent
                            value={client}
                            onChange={this.changeClient}
                            label="All Clients"
                        >
                            <MenuItem value=''><span>All Clients</span></MenuItem>
                            {clients_list.map(({id, name})=>(
                                <MenuItem value={id} key={id}>{name}</MenuItem>
                            ))}
                        </SelectComponent>
                        <SelectComponent
                            value={channel}
                            onChange={this.changeChannel}
                            label="All Channels"
                        >
                            <MenuItem value=''><span>All Channels</span></MenuItem>
                            {channel_items.map(({id, name})=>(
                                <MenuItem value={id} key={id}>{name}</MenuItem>
                            ))}
                        </SelectComponent>
                    </div>
                </div>
                {transactions_error.length !== 0 ? <div className="page_error">{getError(transactions_error)}</div> : null}
                <div className="info_page_wrapper">
                    <div className="table_container transactions_columns">
                        <div className="table_header">
                            <div className="table_row">
                                <p>Date/Time</p>
                                <p>Client</p>
                                <p>Channel</p>
                                <p>Amount</p>
                                <p>Destination</p>
                                <p>TX</p>
                            </div>
                        </div>
                        {!empty && financial_transactions.results && financial_transactions.results.length ?
                            <div className="table_body">
                                {financial_transactions.results.map(({amount, currency, client, channel, blockchain_url, date, description}, i) => (
                                    <div className="table_row" key={i}>
                                        <p className="gray_text">{moment(date).format('DD/MM/YYYY  HH:mm')}</p>
                                        <p className="medium_text">{client !== null && client.id ? <Link to={`/admin/clients/${client.id}/inner/channels`}>{client.name}</Link> : '-'}</p>
                                        <p className="medium_text">{channel !== null && channel.id && client !== null ? <Link to={`/admin/clients/${client.id}/inner/channels/${channel.id}/channel-inner/channel-dashboard`}>{channel.name}</Link> : '-'}</p>
                                        <p className="gray_text">{`${amount} ${currency}`}</p>
                                        <p className="gray_text">{description}</p>
                                        <p>{blockchain_url !== null ? <a href={blockchain_url} target="_blank"><img src="/assets/img/link.png"/></a> : null}</p>
                                    </div>
                                ))}
                            </div>
                            :
                            empty ?
                                <div className="table_body">
                                    <div className="table_row">
                                        <p className="table_no_items">No items</p>
                                    </div>
                                </div>
                                :
                                null
                        }
                        {financial_transactions.count && financial_transactions.count > 20 ?
                            <Pagination
                                current={activePage}
                                pageCount={20}
                                total={financial_transactions.count}
                                onChange={this.changePage}
                            />
                            :
                            null
                        }
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return{
        finances: state.finances
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getFinancialTransactions,
        getClientsList,
        getChannelsList
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);

