import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {channel_items_monitoring, channel_items_finances} from "../../../../helpers/navigation-items";
import Navigation from '../../../Navigation/Navigation';
import BreadCrumbs from '../../../BreadCrumbs/BreadCrumbs';
import Chart from '../Chart/Chart';
import {symbolHash, toFixedHash, hashSymbols, convertHash} from "../../../../helpers/hashrateConvert";

import {getChannelChart} from "../../../../actions/channelsActions";

import HashrateIcon from '../../../../../assets/img/channel-dashboard-hashrate.png';
import MinersIcon from '../../../../../assets/img/channel-dashboard-miners.png';
import InfoIcon from '../../../../../assets/img/channel-dashboard-info.png';
import ChannelHashrateIcon from '../../../../../assets/img/channel-hashrate.png';
import Info_Channel from '../../../../../assets/img/info_channel.png';
import AttentionIcon from '../../../../../assets/img/attention-icon.png';

import './ChannelDashboard.scss';


class ChannelDashboard extends Component {
    constructor(props) {
        super(props);
        const { match } = this.props;
        let pathArr = match.url.split('/');
        this.prevPath  = pathArr.slice(0, pathArr.length - 1).join('/');
        this.state = {
            newData: [],
            symbol: 'H/s',
            loading: true,
            sort: '?interval=day'
        };
    }

    componentDidMount(){
        const {getChannelChart, channels:{channel_detail}, clients:{client_detail}} = this.props;
        const {sort} =this.state;
        let arr = [client_detail.id, channel_detail.id];
        getChannelChart(arr, sort).then(res=>{
            if(res.payload && res.payload.status && res.payload.status === 200){
                this.setState({loading: false});
                this.changeData(res.payload.data);
            }
        });
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
        const {getChannelChart, channels:{channel_detail}, clients:{client_detail}} = this.props;
        let arr = [client_detail.id, channel_detail.id];
        this.setState({loading: true, sort: value});
        getChannelChart(arr, value).then(res=>{
            if(res.payload && res.payload.status && res.payload.status === 200){
                this.setState({loading: false});
                this.changeData(res.payload.data);
            }
        });
    };

    render(){
        const {channels:{channel_detail:{name, hashrate, hashrate24, workers, algorithm, worker_type, pool, watcher_url}}, clients:{client_detail}} = this.props;
        const {newData, symbol, sort, loading} = this.state;
        let breadItems = [
            {url: '/admin/clients', name: 'Clients' },
            {url: `/admin/clients/${client_detail.id}/inner/channels`, name: client_detail.name },
            {url: null, name: name }
        ];
        let showAutoSwitch = client_detail.mode !== 'FM';
        return (
            <div className="channel_dashboard">
                <BreadCrumbs items={breadItems}/>
                <div className="page_header">
                    <h2>{name}</h2>
                </div>
                <div className="page_content_wrapper">
                    <Navigation
                        path={this.prevPath}
                        items={showAutoSwitch ? channel_items_monitoring : channel_items_finances}
                    />
                    <div className="info_page_wrapper">
                        <div className="direction-box-container">
                            <div className="inner-box">
                                <div className="box-container">
                                    <div className="inner-header image-header">
                                        <img src={HashrateIcon}/>
                                        <h1>Hashrate</h1>
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
                            <div className="inner-box">
                                <div className="box-container">
                                    <div className="miners-info-container image-header">
                                        <img src={MinersIcon}/>
                                        <h1>Miners</h1>
                                    </div>
                                    <div className="sub-container">
                                        <div className="hashrate-container space-bottom">
                                            <p className="main-info">{workers[2]}</p>
                                        </div>
                                        <div className="hashrate-container space-bottom">
                                            <p className="description">Active</p>
                                            <p className="description">Inactive</p>
                                        </div>
                                        <div className="hashrate-container">
                                            <p className="main-info"><span className="medium_text">{workers[0]}</span></p>
                                            <p className="main-info"><span className="fail_text">{workers[1]}</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="inner-box channel-info-box">
                                <div className="box-container">
                                    <div className="inner-header image-header">
                                        <img src={InfoIcon}/>
                                        <h1>Channel Info</h1>
                                    </div>
                                    <div className="sub-container">
                                        <div className="hashrate-container space-bottom">
                                            <p className="description">Worker Type:</p>
                                            <p className="main-info">{worker_type}</p>
                                        </div>
                                        <div className="hashrate-container space-bottom">
                                            <p className="description">Algorithm:</p>
                                            <p className="main-info">{algorithm}</p>
                                        </div>
                                        <div className="hashrate-container">
                                            <p className="description">Pool:</p>
                                            {pool === 'Bizard Rent' ?
                                                <p className="main-info dashboard_bizard_rent">
                                                    <img src={AttentionIcon}/>
                                                    <span>{pool}</span>
                                                </p>
                                                :
                                                watcher_url !== null && watcher_url !== '' ?
                                                    <p className="main-info">
                                                        <img src={ChannelHashrateIcon}/>
                                                        <a href={watcher_url} target="_blank">
                                                            {pool}
                                                        </a>
                                                    </p>
                                                    :
                                                    <p className="main-info">
                                                        {pool}
                                                    </p>

                                            }
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
                            <div className="chart_worker" style={{opacity: loading ? 0.7 : 1}}>
                                <Chart data={newData} symbol={symbol} load={loading}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ChannelDashboard.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

function mapStateToProps(state) {
    return{
        channels: state.channels,
        clients: state.clients
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getChannelChart
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelDashboard);