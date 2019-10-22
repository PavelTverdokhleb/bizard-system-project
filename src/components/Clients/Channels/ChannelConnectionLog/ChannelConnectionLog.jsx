import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {channel_items_monitoring, channel_items_finances} from "../../../../helpers/navigation-items";
import Navigation from '../../../Navigation/Navigation';
import BreadCrumbs from '../../../BreadCrumbs/BreadCrumbs';
import SelectComponent from '../../../HelpersBlocks/SelectComponent/SelectComponent';
import MenuItem from '@material-ui/core/MenuItem';
import moment from 'moment';
import TableLoader from '../../../TableLoader/TableLoader';
import Pagination from '../../../Pagination/Pagination';
import {getError} from "../../../../helpers/functions";

import {getChannelLogs} from "../../../../actions/channelsActions";

import SearchIcon from '../../../../../assets/img/search_icon.png';

import './ChannelConnectionLog.scss';

class ChannelConnectionLog extends Component {
    constructor(props) {
        super(props);
        const { match } = this.props;
        let pathArr = match.url.split('/');
        this.prevPath  = pathArr.slice(0, pathArr.length - 1).join('/');
        this.state = {
            type: '',
            period: '',
            activePage: 1,
            loading: true,
            empty: false,
            search: ''
        };
    }

    componentDidMount(){
        const {type, period, activePage} = this.state;
        this.doRequest(type, period, activePage);
    }

    componentWillUnmount(){
        this.props.channels.channel_logs = {};
        this.props.channels.channel_logs_error = [];
    }

    doRequest = (type, period, page) => {
        const {getChannelLogs, clients:{client_detail}, channels:{channel_detail}} = this.props;
        const {search} = this.state;
        let arr = [client_detail.id, channel_detail.id];

        let params = [];
        if(search !== '') {
            params.push( `worker=${encodeURIComponent(search)}`);
        }
        if(type !== '') {
            params.push( `event=${type}`);
        }
        if(period !== '') {
            if(period === 'day') {
                params.push(`start=${encodeURIComponent(moment().subtract(1, 'days').format())}`);
                params.push(`end=${encodeURIComponent(moment().format())}`);
            }
            else if(period === 'month') {
                params.push(`start=${encodeURIComponent(moment().subtract(1, 'months').format())}`);
                params.push(`end=${encodeURIComponent(moment().format())}`);
            }
            else {
                params.push(`start=${encodeURIComponent(moment().subtract(1, 'year').format())}`);
                params.push(`end=${encodeURIComponent(moment().format())}`);
            }
        }
        params.push(`page=${page}`);
        params.push(`page_size=10`);

        this.setState({empty: false, loading: true});
        getChannelLogs(arr, params).then((res)=>{
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

    changeType = event => {
        const {period} = this.state;
        this.setState({ type: event.target.value, activePage: 1 });
        this.doRequest(event.target.value, period, 1);
    };

    changePeriod = event => {
        const { type } = this.state;
        this.setState({ period: event.target.value, activePage: 1 });
        this.doRequest(type, event.target.value, 1);
    };

    changePage = (pageNumber) => {
        const { type, period } = this.state;
        this.setState({activePage: pageNumber});
        this.doRequest(type, period, pageNumber);
    };

    handleSearch = (e) => {
        if (e.keyCode === 13) {
            document.getElementById('search_logs').blur();
            this.setState({type: '', period: '', activePage: 1});
            this.doRequest('', '', 1);
        }
    };

    handleSearchChange = (e) => {
        this.setState({search: e.target.value});
    };

    render(){
        const {clients:{client_detail}, channels:{channel_detail:{name}, channel_logs, channel_logs_error}} = this.props;
        const {type, period, loading, empty, activePage, search} = this.state;
        let breadItems = [
            {url: '/admin/clients', name: 'Clients' },
            {url: `/admin/clients/${client_detail.id}/inner/channels`, name: client_detail.name },
            {url: null, name: name }
        ];
        let showAutoSwitch = client_detail.mode !== 'FM';
        return (
            <div className="connection_log_page">
                <BreadCrumbs items={breadItems}/>
                <div className="page_header">
                    <h2>{name}</h2>
                </div>
                {channel_logs_error.length && channel_logs_error.length !== 0 ? getError(channel_logs_error) : null}
                <div className="page_content_wrapper">
                    <Navigation
                        path={this.prevPath}
                        items={showAutoSwitch ? channel_items_monitoring : channel_items_finances}
                    />
                    <div className="info_page_wrapper">
                        {loading ? <TableLoader/> : null}
                        <div className="table_options_container">
                            <div className="table_filters">
                                <SelectComponent
                                    value={type}
                                    onChange={this.changeType}
                                    label="Event Type"
                                >
                                    <MenuItem value=''><span>All</span></MenuItem>
                                    <MenuItem value={'worker_on'}>Worker on</MenuItem>
                                    <MenuItem value={'worker_off'}>Worker off</MenuItem>
                                </SelectComponent>
                                <SelectComponent
                                    value={period}
                                    onChange={this.changePeriod}
                                    label="Time Period"
                                >
                                    <MenuItem value=''><span>All</span></MenuItem>
                                    <MenuItem value='day'>Day</MenuItem>
                                    <MenuItem value='month'>Month</MenuItem>
                                    <MenuItem value='year'>Year</MenuItem>
                                </SelectComponent>
                            </div>
                            <div className="table_search">
                                <input
                                    type="text"
                                    id="search_logs"
                                    className="workers-search"
                                    onKeyDown={this.handleSearch}
                                    onChange={this.handleSearchChange}
                                    value={search}
                                    placeholder="Search"
                                />
                                <span className="search_icon"><img src={SearchIcon}/></span>
                            </div>
                        </div>

                        <div className="table_container connection_log_columns">
                            <div className="table_header">
                                <div className="table_row">
                                    <p>Date/Time</p>
                                    <p>Worker Name</p>
                                    <p>Event</p>
                                </div>
                            </div>
                            <div className="table_body">
                                {!empty && channel_logs.results && channel_logs.results.length ?
                                    channel_logs.results.map(({date, worker, event}, i) => (
                                        <div className="table_row" key={i}>
                                            <p className="gray_text">{moment(date).format('DD/MM/YY HH:mm')}</p>
                                            <p className="gray_text medium_text">{worker.name}</p>
                                            <p className="gray_text">{event}</p>
                                        </div>
                                    ))
                                    :
                                    empty ?
                                        <div className="table_row">
                                            <p>No items</p>
                                            <p></p>
                                        </div>
                                        :
                                        null
                                }
                            </div>
                            {channel_logs.count && channel_logs.count > 10 ?
                                <Pagination
                                    current={activePage}
                                    pageCount={10}
                                    total={channel_logs.count}
                                    onChange={this.changePage}
                                />
                                :
                                null
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ChannelConnectionLog.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

function mapStateToProps(state) {
    return{
        clients: state.clients,
        channels: state.channels
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getChannelLogs
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelConnectionLog);