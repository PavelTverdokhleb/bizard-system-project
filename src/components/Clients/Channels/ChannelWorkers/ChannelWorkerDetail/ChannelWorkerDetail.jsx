import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import BreadCrumbs from '../../../../BreadCrumbs/BreadCrumbs';
import Chart from '../../Chart/Chart';
import {hashSymbols, toFixedHash, symbolHash, convertHash} from "../../../../../helpers/hashrateConvert";
import NoMatch from '../../../../../containers/NoMatch/NoMatch';
import Loader from "../../../../Loader/Loader";
import HardwareItem from './HardwareItem/HardwareItem';

import {getWorkerDetail, getWorkerChart} from "../../../../../actions/workersActions";

import HashrateIcon from '../../../../../../assets/img/channel-dashboard-hashrate.png';
import ConditionIcon from '../../../../../../assets/img/conditions-icon.png';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import './ChannelWorkerDetail.scss';

class ChannelWorkerDetail extends Component {
    state = {
        newData: [],
        symbol: 'H/s',
        loading: true,
        loadingChart: true,
        sort: '?interval=day',
        notFound: false
    };

    componentDidMount(){
        const {getWorkerDetail, getWorkerChart, channels:{channel_detail}, clients:{client_detail}, match:{params:{worker}}} = this.props;
        const {sort} = this.state;
        let arr = [client_detail.id, channel_detail.id, worker];
        getWorkerDetail(arr).then(res=>{
            if(res.payload && res.payload.status && res.payload.status === 200){
                this.setState({loading: false});
            }
            else if(res.error && res.error.response && res.error.response.status === 404){
                this.setState({notFound: true});
            }
        });
        getWorkerChart(arr, sort).then(res=>{
            if(res.payload && res.payload.status && res.payload.status === 200 && res.payload.data && res.payload.data !== 'not yet'){
                this.setState({loadingChart: false});
                this.changeData(res.payload.data);
            }
        });
    }

    componentWillUnmount(){
        this.props.workers.worker_detail = {};
    }

    changeData = (data) => {
        let newData = [];
        let biggest = 0;
        if(data.length){
            for(let i = 0; i < hashSymbols.length; i++){
                let count = 0;
                data.forEach((item)=>{
                    if (hashSymbols[i] === symbolHash(item.p) && item.p !== 0) {
                        count++;
                    }
                });
                if(count > data.length / 2) {
                    this.setState({symbol: hashSymbols[i]});
                    break;
                }
                else if(count > biggest) {
                    biggest = count;
                    this.setState({symbol: hashSymbols[i]});
                }
            }
            for (let i = 0; i < data.length; i++) {
                let time = data[i].d;
                let timeRep = new Date(time).getTime();
                let value = convertHash(this.state.symbol, data[i].p);
                let arr = [timeRep, Number(value)];
                newData.push(arr);
            }
        }
        let dataSeries = [{
            name: 'Hashrate',
            yAxis: 0,
            dataGrouping:{
                enabled:false
            },
            color: '#29323C',
            data: newData
        }];
        this.setState({newData: dataSeries});
    };

    handleChangeChart = (value) => {
        const {getWorkerChart, channels:{channel_detail}, clients:{client_detail}, match:{params:{worker}}} = this.props;
        let arr = [client_detail.id, channel_detail.id, worker];
        this.setState({loadingChart: true, sort: value});
        getWorkerChart(arr, value).then(res=>{
            if(res.payload && res.payload.status && res.payload.status === 200){
                this.setState({loadingChart: false});
                this.changeData(res.payload.data);
            }
        });
    };

    render(){
        const {workers:{worker_detail:{key, hashrate, hashrate24, rejected, active, miners}}, clients:{client_detail}, channels:{channel_detail}} = this.props;
        const {loading, loadingChart, notFound, newData, symbol, sort} = this.state;
        let breadItems = [
            {url: '/admin/clients', name: 'Clients' },
            {url: `/admin/clients/${client_detail.id}/inner/channels`, name: client_detail.name },
            {url: `/admin/clients/${client_detail.id}/inner/channels/${channel_detail.id}/channel-inner/channel-workers`, name: channel_detail.name },
            {url: null, name: key }
        ];

        if(notFound) return <NoMatch/>;
        else if(loading) return <Loader class="page"/>;
        return (
            <div className="worker_detail">
                <BreadCrumbs items={breadItems}/>
                <div className="page_header">
                    <h2>{key}</h2>
                </div>
                <div className="page_content_wrapper">

                    <div className="workers-id">
                        <div className="inner-box hashrate-block">
                            <div className="box-container">
                                <div className="inner-header image-header">
                                    <img src={HashrateIcon}/>
                                    <h1>Single Hashrate</h1>
                                </div>
                                <div className="sub-container">
                                    <div className="hashrate-container space-bottom">
                                        <p className="description">Real Time</p>
                                        <p className="description">24H</p>
                                    </div>
                                    <div className="hashrate-container">
                                        <p className="main-info">
                                            {toFixedHash(hashrate)}
                                            <span className="description">&nbsp;{symbolHash(hashrate)}</span>
                                        </p>
                                        <p className="main-info">
                                            {toFixedHash(hashrate24)}
                                            <span className="description">&nbsp;{symbolHash(hashrate24)}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="inner-box running-block">
                            <div className="box-container">
                                <div className="inner-header image-header">
                                    <img src={ConditionIcon}/>
                                    <h1> Running Condition</h1>
                                </div>
                                <div className="sub-container">
                                    <div className="hashrate-container space-bottom">
                                        <p className="description">Rejected</p>
                                        <p className="description">Status</p>
                                    </div>
                                    <div className="hashrate-container">
                                        <p className="main-info">{rejected}%</p>
                                        <p className="main-info">
                                            {active ?
                                                <span className="cell_centered worker_status_active">
                                                    <FiberManualRecordIcon fontSize="default"/>
                                                    Mining
                                                </span>
                                                :
                                                <span className="cell_centered worker_status_inactive">
                                                    <FiberManualRecordIcon fontSize="default"/>
                                                    Stopped
                                                </span>
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="inner-box chart_block">
                        <div className="inner-header chart-header">
                            <h1>Hashrate Chart</h1>
                            <div className="chart_btn">
                                <button className={sort === '?interval=day' ? "active_chart_btn" : null} onClick={()=>{this.handleChangeChart('?interval=day')}}>1D</button>
                                <button className={sort === '' ? "active_chart_btn" : null} onClick={()=>{this.handleChangeChart('')}}>1H</button>
                            </div>
                        </div>
                        <div className="chart_worker" style={{opacity: loadingChart ? 0.7 : 1}}>
                            <Chart data={newData} symbol={symbol} load={loadingChart}/>
                        </div>
                    </div>

                    <div className="inner-box">
                        <div className="inner-header chart-header">
                            <h1>Hardware Info</h1>
                        </div>
                        <div className="hardware_table worker_hardware_columns">
                            <div className="table_header">
                                <div className="table_row">
                                    <button className="order_btn">Miner Ip</button>
                                    <button className="order_btn">Status</button>
                                    <button className="order_btn">Progress</button>
                                    <button className="order_btn">Hashrate</button>
                                    <button className="order_btn">Last update</button>
                                </div>
                            </div>
                            <div className="table_body">
                                {typeof miners !== 'undefined' && miners.length > 0 ?
                                    miners.map((el, i)=>(
                                        <HardwareItem {...el} key={i}/>
                                    ))
                                    :
                                    <div className="hardware_no_items">
                                        <p className="gray_text">No items</p>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

ChannelWorkerDetail.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

function mapStateToProps(state) {
    return{
        workers: state.workers,
        channels: state.channels,
        clients: state.clients
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getWorkerDetail,
        getWorkerChart
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelWorkerDetail);