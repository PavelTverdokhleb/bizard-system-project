import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {channel_items_monitoring, channel_items_finances} from "../../../../helpers/navigation-items";
import Navigation from '../../../Navigation/Navigation';
import BreadCrumbs from '../../../BreadCrumbs/BreadCrumbs';
import {getError} from "../../../../helpers/functions";
import TableLoader from '../../../TableLoader/TableLoader';
import Pagination from '../../../Pagination/Pagination';
import moment from 'moment';

import {getChannelPoolSwitching} from "../../../../actions/channelsActions";

import './ChannelsPoolSwitchLog.scss';

class ChannelsPoolSwitchLog extends Component {
    constructor(props) {
        super(props);
        const { match } = this.props;
        let pathArr = match.url.split('/');
        this.prevPath  = pathArr.slice(0, pathArr.length - 1).join('/');
        this.state = {
            activePage: 1,
            loading: true,
            empty: false
        };
    }

    componentDidMount(){
        const {activePage} = this.state;
        this.doRequest(activePage);
    }

    doRequest = (page) => {
        const {getChannelPoolSwitching, clients:{client_detail}, channels:{channel_detail}} = this.props;
        let arr = [client_detail.id, channel_detail.id];
        this.setState({empty: false, loading: true});
        getChannelPoolSwitching(arr, page).then((res)=>{
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

    changePage = (pageNumber) => {
        this.setState({activePage: pageNumber});
        this.doRequest(pageNumber);
    };

    render(){
        const {channels:{channel_pool_switching, channel_pool_switching_error, channel_detail:{name}}, clients:{client_detail}} = this.props;
        const {loading, empty, activePage} = this.state;
        let breadItems = [
            {url: '/admin/clients', name: 'Clients' },
            {url: `/admin/clients/${client_detail.id}/inner/channels`, name: client_detail.name },
            {url: null, name: name }
        ];
        let showAutoSwitch = client_detail.mode !== 'FM';
        return (
            <div className="pool-switch-log-page">
                <BreadCrumbs items={breadItems}/>
                <div className="page_header">
                    <h2>{name}</h2>
                </div>
                {channel_pool_switching_error.length && channel_pool_switching_error.length !== 0 ? getError(channel_pool_switching_error) : null}
                <div className="page_content_wrapper">
                    <Navigation
                        path={this.prevPath}
                        items={showAutoSwitch ? channel_items_monitoring : channel_items_finances}
                    />

                    <div className="info_page_wrapper">
                        {loading ? <TableLoader/> : null}
                        <div className="table_container pool_switch_columns">
                            <div className="table_header">
                                <div className="table_row">
                                    <p>Date/Time</p>
                                    <p>Channel Name</p>
                                    <p>Action</p>
                                </div>
                            </div>
                            <div className="table_body">
                                {!empty && channel_pool_switching.results && channel_pool_switching.results.length ?
                                    channel_pool_switching.results.map(({date, channel_name, old_pool, new_pool, old_watcher_url, new_watcher_url}, i) => (
                                        <div className="table_row" key={i}>
                                            <p className="gray_text">{moment(date).format('DD/MM/YYYY HH:mm')}</p>
                                            <p className="gray_text medium_text">{channel_name}</p>
                                            <div className="gray_text">
                                                <div className="pool_switch_block">
                                                    <p className="flex-center">
                                                        <span>Switched</span>
                                                        {old_watcher_url !== null && old_watcher_url !== '' ?
                                                            <span className="pool_switch_text">
                                                                <img src="../../../../assets/img/shape.svg" alt="icon"/>
                                                                <a href={old_watcher_url} target="_blank">
                                                                    {old_pool}
                                                                </a>
                                                            </span>
                                                            :
                                                            <span className="pool_switch_text">{old_pool}</span>
                                                        }
                                                        &#8594;
                                                        {new_watcher_url !== null && new_watcher_url !== '' ?
                                                            <span className="pool_switch_text">
                                                                <img src="../../../../assets/img/shape.svg" alt="icon"/>
                                                                <a href={new_watcher_url} target="_blank">
                                                                    {new_pool}
                                                                </a>
                                                            </span>
                                                            :
                                                            <span className="pool_switch_text">{new_pool}</span>
                                                        }
                                                    </p>
                                                </div>
                                            </div>
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
                            {channel_pool_switching.count && channel_pool_switching.count > 10 ?
                                <Pagination
                                    current={activePage}
                                    pageCount={10}
                                    total={channel_pool_switching.count}
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

ChannelsPoolSwitchLog.contextTypes = {
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
        getChannelPoolSwitching
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelsPoolSwitchLog);