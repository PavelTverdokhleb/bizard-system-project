import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {Link} from 'react-router-dom';
import {channel_items_monitoring, channel_items_finances} from "../../../../helpers/navigation-items";
import Navigation from '../../../Navigation/Navigation';
import BreadCrumbs from '../../../BreadCrumbs/BreadCrumbs';
import TableLoader from '../../../TableLoader/TableLoader';
import OrderButton from '../../../Buttons/OrderButton/OrderButton';
import Pagination from '../../../Pagination/Pagination';
import MiningStatusWorker from './MiningStatusWorker/MiningStatusWorker';
import {symbolHash, toFixedHash} from "../../../../helpers/hashrateConvert";

import {getWorkers} from "../../../../actions/workersActions";

import MinersIcon from '../../../../../assets/img/miners_icon.png';
import SearchIcon from '../../../../../assets/img/search_icon.png';

import './ChannelWorkers.scss';

class ChannelWorkers extends Component {
    constructor(props) {
        super(props);
        const { match } = this.props;
        let pathArr = match.url.split('/');
        this.prevPath  = pathArr.slice(0, pathArr.length - 1).join('/');
        this.state = {
            active_tab: 'active',
            order: null,
            loading: false,
            empty: false,
            activePage: 1,
            search: ''
        }
    }

    componentDidMount(){
        const {active_tab, order, activePage} = this.state;
        this.doRequest(active_tab, order, activePage);
    }

    componentWillUnmount(){
        this.props.workers.workers_list = {};
    }

    doRequest = (status, order, page) => {
        const {getWorkers, clients:{client_detail}, channels:{channel_detail}} = this.props;
        const {search} = this.state;
        let arr = [client_detail.id, channel_detail.id];

        let params = [];
        if(search !== '') {
            params.push( `key=${encodeURIComponent(search)}`);
        }
        if(status !== 'all') {
            params.push( `active=${status === 'active'}`);
        }
        if(order !== null) {
            params.push(`ordering=${order}`);
        }
        params.push(`page=${page}`);
        params.push(`page_size=50`);

        this.setState({empty: false, loading: true});
        getWorkers(arr, params).then((res)=>{
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

    filterTab = (field) => {
        const {order} = this.state;
        this.setState({active_tab: field, activePage: 1});
        this.doRequest(field, order, 1);
    };

    sortData = (field) => {
        const { active_tab, order, activePage } = this.state;
        let ord = '';
        if(order === `-${field}`) ord = field;
        else if (order === field) ord = `-${field}`;
        else ord = field;
        this.setState({order: ord});
        this.doRequest(active_tab, ord, activePage);
    };

    changePage = (pageNumber) => {
        const { active_tab, order } = this.state;
        this.setState({activePage: pageNumber});
        this.doRequest(active_tab, order, pageNumber);
    };

    handleSearch = (e) => {
        if (e.keyCode === 13) {
            document.getElementById('search_workers').blur();
            this.setState({active_tab: 'all', order: null, activePage: 1});
            this.doRequest('all', null, 1);
        }
    };

    handleSearchChange = (e) => {
        this.setState({search: e.target.value});
    };

    minersCount(num) {
        if(num === 1) {
            return `${num} miner`;
        }
        else {
            return `${num} miners`;
        }
    };

    render(){
        const {match, channels:{channel_detail}, workers:{workers_list}, clients:{client_detail}} = this.props;
        const {active_tab, order, loading, empty, activePage, search} = this.state;
        let breadItems = [
            {url: '/admin/clients', name: 'Clients' },
            {url: `/admin/clients/${client_detail.id}/inner/channels`, name: client_detail.name },
            {url: null, name: channel_detail.name }
        ];
        let showAutoSwitch = client_detail.mode !== 'FM';
        return (
            <div className="channel_workers">
                <BreadCrumbs items={breadItems}/>
                <div className="page_header">
                    <h2>{channel_detail.name}</h2>
                </div>
                <div className="page_content_wrapper">
                    <Navigation
                        path={this.prevPath}
                        items={showAutoSwitch ? channel_items_monitoring : channel_items_finances}
                    />

                    <div className="info_page_wrapper">
                        {loading ? <TableLoader/> : null}

                        <div className="table_options_container">
                            {!workers_list || !workers_list.all && workers_list.all !== 0 ?
                                <div></div>
                                :
                                <div className="table_tabs">
                                    <button
                                        className={active_tab === 'active' ? "active_table_tab" : null}
                                        onClick={() => {
                                            this.filterTab('active')
                                        }}
                                    >
                                        Active ({workers_list.active})
                                    </button>
                                    <button
                                        className={active_tab === 'inactive' ? "active_table_tab" : null}
                                        onClick={() => {
                                            this.filterTab('inactive')
                                        }}
                                    >
                                        Inactive ({workers_list.inactive})
                                    </button>
                                    <button
                                        className={active_tab === 'all' ? "active_table_tab" : null}
                                        onClick={() => {
                                            this.filterTab('all')
                                        }}
                                    >
                                        All ({workers_list.all})
                                    </button>
                                    {workers_list.total ? <p className="workers_total_hashrate">Total: {`${toFixedHash(workers_list.total)} ${symbolHash(workers_list.total)}`}</p> : null}
                                </div>
                            }
                            <div className="table_search">
                                <input
                                    type="text"
                                    id="search_workers"
                                    className="workers-search"
                                    onKeyDown={this.handleSearch}
                                    onChange={this.handleSearchChange}
                                    value={search}
                                    placeholder="Search"
                                />
                                <span className="search_icon"><img src={SearchIcon}/></span>
                            </div>
                        </div>

                        <div className="table_container channel_workers_columns">
                            <div className="table_header">
                                <div className="table_row">
                                    <OrderButton
                                        text="Name"
                                        order={order}
                                        field={'key'}
                                        sort={()=>{this.sortData('key')}}
                                        disabled={empty}
                                    />
                                    <OrderButton
                                        text="Real Time"
                                        order={order}
                                        field={'hashrate'}
                                        sort={()=>{this.sortData('hashrate')}}
                                        disabled={empty}
                                    />
                                    <OrderButton
                                        text="Daily"
                                        order={order}
                                        field={'hashrate24'}
                                        sort={()=>{this.sortData('hashrate24')}}
                                        disabled={empty}
                                    />
                                    <OrderButton
                                        text="Progress"
                                        order={order}
                                        field={'accepted'}
                                        sort={()=>{this.sortData('accepted')}}
                                        disabled={empty}
                                    />
                                    <OrderButton
                                        text="Status"
                                        order={order}
                                        field={'active'}
                                        sort={()=>{this.sortData('active')}}
                                        disabled={empty || active_tab === 'active' || active_tab === 'inactive'}
                                    />
                                </div>
                            </div>
                            <div className="table_body">
                                {!empty && workers_list.results && workers_list.results.length ?
                                    workers_list.results.map(({id, key, miners_count, hashrate, hashrate24, accepted, rejected, hardware_errors_count, active, miners_temp_range})=> {
                                        let sum = accepted + rejected;
                                        return (
                                            <div className="table_row" key={id}>
                                                <p className="workers_name">
                                                    <Link to={`${match.url}/${id}`}>
                                                        {key}
                                                    </Link>
                                                    {miners_count !== null && miners_count !== 0 ?
                                                        <span>
                                                            <img src={MinersIcon} alt="miners icon"/>
                                                            {this.minersCount(miners_count)}
                                                        </span>
                                                        :
                                                        null
                                                    }
                                                </p>

                                                <p className="gray_text">{`${toFixedHash(hashrate)} ${symbolHash(hashrate)}`}</p>
                                                <p className="gray_text">{`${toFixedHash(hashrate24)} ${symbolHash(hashrate24)}`}</p>

                                                <div className="status_block">
                                                    <p className="gray_text">Accepted: <span className="green_text">{accepted}</span></p>
                                                    <p className="gray_text">Rejected: <span className="red_text">{rejected} ({sum !== 0 ? Number(rejected * 100 / sum).toFixed(2) : rejected}%)</span></p>
                                                    <p className="gray_text">Hardware Errors: {hardware_errors_count}</p>
                                                </div>

                                                <MiningStatusWorker
                                                    active={active}
                                                    temperature={miners_temp_range}
                                                    showTooltip
                                                />
                                            </div>
                                        );
                                    })
                                    :
                                    empty ?
                                        <div className="table_row">
                                            <p className="table_no_items">No items</p>
                                        </div>
                                        :
                                        null
                                }
                            </div>
                            {workers_list.count && workers_list.count > 50 ?
                                <Pagination
                                    current={activePage}
                                    pageCount={50}
                                    total={workers_list.count}
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

ChannelWorkers.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

function mapStateToProps(state) {
    return{
        clients: state.clients,
        channels: state.channels,
        workers: state.workers
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getWorkers
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelWorkers);