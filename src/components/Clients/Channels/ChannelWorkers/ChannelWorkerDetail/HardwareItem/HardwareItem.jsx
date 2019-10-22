import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MiningStatusWorker from '../../MiningStatusWorker/MiningStatusWorker';
import {toFixedHash, symbolHash} from "../../../../../../helpers/hashrateConvert";
import ErrorLog from './ErrorLog/ErrorLog';
import Chart from '../../../Chart/Chart';
import moment from 'moment';

import {getMinerChart} from "../../../../../../actions/workersActions";

import './HardwareItem.scss';

class HardwareItem extends Component {
    state = {
        tab: 0,
        chartData: [],
        sort: 'day',
        loadingChart: true
    };

    changeTab = (event, value) => {
        this.setState({ tab: value });
    };

    expandPanel = (event, expanded) => {
        const {getMinerChart, id} = this.props;
        const {chartData, sort} = this.state;
        if(expanded && chartData.length === 0) {
            getMinerChart(id, sort).then(res=>{
                if(res.payload && res.payload.status && res.payload.status === 200 && res.payload.data && res.payload.data !== 'not yet'){
                    this.changeData(res.payload.data);
                    this.setState({loadingChart: false})
                }
            });
        }
    };

    handleChangeChart = (value) => {
        const {getMinerChart, id} = this.props;
        this.setState({loadingChart: true, sort: value});
        getMinerChart(id, value).then(res=>{
            if(res.payload && res.payload.status && res.payload.status === 200){
                this.setState({loadingChart: false});
                this.changeData(res.payload.data);
            }
        });
    };

    changeData = (data) => {
        let newData = [];
        if(data.length){
            for (let i = 0; i < data.length; i++) {
                let time = data[i].d;
                let timeRep = new Date(time).getTime();
                let value = data[i].p;
                let arr = [timeRep, Number(value)];
                newData.push(arr);
            }
        }
        let dataSeries = [{
            name: 'Temperature',
            yAxis: 0,
            dataGrouping:{
                enabled:false
            },
            color: '#29323C',
            data: newData
        }];
        this.setState({chartData: dataSeries});
    };

    render(){
        const {ip_address, status, accept, reject, reject_percent, hardware_errors, hash, hash_avg, last_temp, update_date} = this.props;
        const {tab, chartData, sort, loadingChart} = this.state;
        return (
            <ExpansionPanel
                classes={{
                    root: 'hardware_item_wrapper'
                }}
                onChange={this.expandPanel}
            >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <div className="table_row">
                        <p className="medium_text">{ip_address}</p>
                        <MiningStatusWorker
                            active={status}
                            temperature={[last_temp]}
                        />
                        <div className="status_block">
                            <p className="gray_text">Accepted: <span className="green_text">{accept}</span></p>
                            <p className="gray_text">Rejected: <span className="red_text">{reject} ({Number(reject_percent).toFixed(2)}%)</span></p>
                            <p className="gray_text">Hardware Errors: {hardware_errors}</p>
                        </div>
                        <div className="status_block">
                            <p className="gray_text">Real Time: <span className="medium_text">{`${toFixedHash(hash)} ${symbolHash(hash)}`}</span></p>
                            <p className="gray_text">Daily: {`${toFixedHash(hash_avg)} ${symbolHash(hash_avg)}`}</p>
                        </div>
                        <p className="gray_text">{moment(update_date).fromNow()}</p>
                    </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails
                    classes={{
                        root: 'hardware_detail_wrapper'
                    }}
                >
                    <Tabs
                        value={tab}
                        onChange={this.changeTab}
                        classes={{
                            root: 'hardware_tabs_wrapper',
                            indicator: 'tabs_indicator'
                        }}
                    >
                        <Tab label="Temperature Chart" classes={{selected: 'tab_active'}} />
                        <Tab label="Error Log" classes={{selected: 'tab_active'}} />
                    </Tabs>
                    <div>
                        {tab === 0 &&
                            <div className="miners_chart_wrapper">
                                <div className="inner-header chart-header">
                                    <div className="chart_btn">
                                        <button className={sort === 'day' ? "active_chart_btn" : null} onClick={()=>{this.handleChangeChart('day')}}>1D</button>
                                        <button className={sort === 'hour' ? "active_chart_btn" : null} onClick={()=>{this.handleChangeChart('hour')}}>1H</button>
                                        <button className={sort === '5min' ? "active_chart_btn" : null} onClick={()=>{this.handleChangeChart('5min')}}>5M</button>
                                    </div>
                                </div>
                                <div className="chart_worker" style={{opacity: loadingChart ? 0.7 : 1}}>
                                    <Chart
                                        data={chartData}
                                        axisName="Temperature"
                                        symbol="°С"
                                        load={loadingChart}
                                    />
                                </div>
                            </div>
                        }
                        {tab === 1 &&
                        <ErrorLog/>
                        }
                    </div>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}

function mapStateToProps(state) {
    return{
        //name: state.name
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getMinerChart
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HardwareItem);