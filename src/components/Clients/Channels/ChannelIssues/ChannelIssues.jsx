import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {channel_items_monitoring, channel_items_finances} from "../../../../helpers/navigation-items";
import Navigation from '../../../Navigation/Navigation';
import BreadCrumbs from '../../../BreadCrumbs/BreadCrumbs';
import TableLoader from '../../../TableLoader/TableLoader';
import {getError} from "../../../../helpers/functions";
import Pagination from '../../../Pagination/Pagination';
import moment from 'moment';

import {getChannelIssues} from "../../../../actions/channelsActions";

import './ChannelIssues.scss';


class ChannelIssues extends Component {
    constructor(props) {
        super(props);
        const { match } = this.props;
        let pathArr = match.url.split('/');
        this.prevPath  = pathArr.slice(0, pathArr.length - 1).join('/');
        this.state = {
            loading: true,
            empty: false,
            activePage: 1
        };
    }

    componentDidMount(){
        const {activePage} = this.state;
        this.doRequest(activePage);
    }

    componentWillUnmount(){
        this.props.channels.channel_issues = [];
        this.props.channels.channel_issues_error = [];
    }

    doRequest = (page) => {
        const {getChannelIssues, clients:{client_detail}, channels:{channel_detail}} = this.props;
        let arr = [client_detail.id, channel_detail.id];
        this.setState({loading: true});
        getChannelIssues(arr, page).then((res)=>{
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

    changePage = pageNumber => {
        this.setState({activePage: pageNumber});
        this.doRequest(pageNumber);
    };

    render(){
        const {clients:{client_detail}, channels:{channel_detail:{name}, channel_issues, channel_issues_error}} = this.props;
        const {loading, empty, activePage} = this.state;
        let breadItems = [
            {url: '/admin/clients', name: 'Clients' },
            {url: `/admin/clients/${client_detail.id}/inner/channels`, name: client_detail.name },
            {url: null, name: name }
        ];
        let showAutoSwitch = client_detail.mode !== 'FM';
        return (
            <div className="issues_page">
                <BreadCrumbs items={breadItems}/>
                <div className="page_header">
                    <h2>{name}</h2>
                </div>
                {channel_issues_error.length && channel_issues_error.length !== 0 ? getError(channel_issues_error) : null}
                <div className="page_content_wrapper">
                    <Navigation
                        path={this.prevPath}
                        items={showAutoSwitch ? channel_items_monitoring : channel_items_finances}
                    />
                    <div className="info_page_wrapper">
                        {loading ? <TableLoader/> : null}
                        <div className="table_container issues_columns">
                            <div className="table_header">
                                <div className="table_row">
                                    <p>Date/Time</p>
                                    <p>Event</p>
                                    <p>Description</p>
                                </div>
                            </div>
                            <div className="table_body">
                                {!empty && channel_issues.results && channel_issues.results.length ?
                                    channel_issues.results.map((el, i)=> (
                                        <div className="table_row" key={i}>
                                            <p className="gray_text">{moment(el.date).format('DD/MM/YYYY HH:mm')}</p>
                                            <p className="gray_text">{el.event}</p>
                                            <p className="gray_text">{el.description}</p>
                                        </div>
                                    ))
                                    :
                                    empty ?
                                        <div className="table_row">
                                            <p className="table_no_items">No items</p>
                                        </div>
                                        :
                                        null
                                }
                            </div>
                            {channel_issues.count && channel_issues.count > 10 ?
                                <Pagination
                                    current={activePage}
                                    pageCount={10}
                                    total={channel_issues.count}
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

ChannelIssues.contextTypes = {
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
        getChannelIssues
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelIssues);