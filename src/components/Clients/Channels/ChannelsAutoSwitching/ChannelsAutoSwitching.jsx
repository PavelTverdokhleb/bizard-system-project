import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {channel_items_monitoring} from '../../../../helpers/navigation-items';
import BreadCrumbs from '../../../BreadCrumbs/BreadCrumbs';
import Navigation from '../../../Navigation/Navigation';
import AutoSwitch from './AutoSwitch/AutoSwitch';
import Pingator from './Pingator/Pingator';
import SelectComponent from '../../../HelpersBlocks/SelectComponent/SelectComponent';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Loader from "../../../Loader/Loader";
import {Link} from 'react-router-dom';
import TableLoader from "../../../TableLoader/TableLoader";
import {toFixedHash, symbolHash} from "../../../../helpers/hashrateConvert";

import {getWTMList} from "../../../../actions/channelsActions";

import './ChannelsAutoSwitching.scss';


class ChannelsAutoSwitching extends Component {
    constructor(props) {
        super(props);
        const { match } = this.props;
        let pathArr = match.url.split('/');
        this.prevPath  = pathArr.slice(0, pathArr.length - 1).join('/');
        this.state = {
            loading: false,
            empty: false,
            type: 'all'
        };
    }

    componentDidMount() {
        const {type} = this.state;
        this.doRequest(type);
    }

    componentWillUnmount(){
        this.props.channels.wtm_list = {};
    }

    doRequest = (type) => {
        const {getWTMList, channels:{channel_detail:{id}}, clients:{client_detail}} = this.props;
        let arr = [client_detail.id, id];
        this.setState({loading: true, empty: false});
        getWTMList(arr, type).then((res)=>{
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
        this.setState({ type: event.target.value });
        this.doRequest(event.target.value);
    };

    statusRow = (status) => {
        switch (status) {
            case 'active':
                return 'active-row';
            case 'inactive':
                return 'inactive-row';
            default:
                return '';
        }
    };

    render(){
        const {channels:{channel_detail:{name, id}, wtm_list}, clients:{client_detail}} = this.props;
        const {type, loading, empty} = this.state;
        let breadItems = [
            {url: '/admin/clients', name: 'Clients' },
            {url: `/admin/clients/${client_detail.id}/inner/channels`, name: client_detail.name },
            {url: null, name: name }
        ];
        let ids = [client_detail.id, id];
        return (
            <div className="switching_page">
                <BreadCrumbs items={breadItems}/>
                <div className="page_header">
                    <h2>{name}</h2>
                </div>
                <div className="page_content_wrapper">
                    <Navigation
                        path={this.prevPath}
                        items={channel_items_monitoring}
                    />
                    <div className="info_page_wrapper">
                        {loading && wtm_list && wtm_list.hashrate ? <TableLoader/> : null}
                        {wtm_list && wtm_list.algorithm ?
                            <div>
                                <div className="auto_switch_inner">
                                    <AutoSwitch
                                        name={name}
                                        ids={ids}
                                        rent={wtm_list.rent}
                                        ping={wtm_list.ping}
                                        auto_switch={wtm_list.auto_switch}
                                        auto_switch_time={wtm_list.auto_switch_time}
                                    />
                                    <Pingator
                                        name={name}
                                        ids={ids}
                                        auto_switch={wtm_list.auto_switch}
                                        ping={wtm_list.ping}
                                        ping_time={wtm_list.ping_time}
                                    />
                                </div>
                                <div className="auto_top_table_block">
                                    <div>
                                        <div className="auto_top_caption">
                                            <div>{wtm_list.algorithm} profitability rank (by Whattomine)</div>
                                            <div>for your channel hashrate {toFixedHash(wtm_list.hashrate)} {symbolHash(wtm_list.hashrate)}</div>
                                        </div>
                                        <div className="profitability-status">
                                            <div><i className="active-status"></i>Active</div>
                                            <div><i className="inactive-status"></i>Inactive</div>
                                            <div><i className="not-configured-status"></i>Not Configured</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="table_filters">
                                            <SelectComponent
                                                value={type}
                                                onChange={this.changeType}
                                            >
                                                <MenuItem value='all'>All Coins</MenuItem>
                                                <MenuItem value='my'>My Coins</MenuItem>
                                            </SelectComponent>
                                        </div>
                                    </div>
                                </div>
                                <div className="table_container switching_columns">
                                    <div className="table_header">
                                        <div className="table_row">
                                            <p>Coin Name <br/>Algorithm</p>
                                            <p>Est. Rewards <br/>Est. Rewards 24h</p>
                                            <p>Rev. BTC <br/>Rev. 24h</p>
                                            <p>Revenue <br/>$/day</p>
                                            <p>Profitability <br/>Current | 24h</p>
                                            <p>Primary Pool</p>
                                        </div>
                                    </div>
                                    <div className="table_body">
                                        {!empty && wtm_list.results && wtm_list.results.length ?
                                            wtm_list.results.map((el, i)=>(
                                                <div className={`table_row ${this.statusRow(el.status)}`} key={i}>
                                                    <div className="gray_text cell_centered">
                                                        {el.logo && el.logo !== null ?
                                                            <div className="icon-coin">
                                                                <img src={el.logo}/>
                                                            </div>
                                                            :
                                                            null
                                                        }
                                                        <div className="switch_coin_name">
                                                            <span>{el.currency}</span>
                                                            <br/>
                                                            {wtm_list.algorithm}
                                                        </div>
                                                    </div>
                                                    <p className="gray_text">{el.estimated_rewards}<br/>{el.estimated_rewards24}</p>
                                                    <p className="gray_text">{el.btc_revenue}<br/>{el.btc_revenue24}</p>
                                                    <p className="revenue_text">$ {(parseInt(el.usd_revenue * 100)) / 100}</p>
                                                    <p className="gray_text">
                                                        <span className="switch_profit">{el.profitability}% </span> &Iota; {el.profitability24}%
                                                    </p>
                                                    <div>
                                                        {el.currency === 'Bizard Rent' ?
                                                            <p>{el.primary_pool}</p>
                                                            : el.primary_pool
                                                                ? <p>{el.primary_pool}</p>
                                                                :
                                                                <Link to={`/admin/clients/${client_detail.id}/inner/pools/${wtm_list.algorithm}/add-pool?coin=${encodeURIComponent(el.currency)}`}>
                                                                    <div className="btn_create_pool">
                                                                        <Button variant="outlined">
                                                                            Create pool
                                                                        </Button>
                                                                    </div>
                                                                </Link>
                                                        }
                                                    </div>
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
                                </div>
                            </div>
                            :
                            <Loader class="page_client_inner"/>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

ChannelsAutoSwitching.contextTypes = {
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
        getWTMList
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelsAutoSwitching);