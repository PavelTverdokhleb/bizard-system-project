import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {Switch, Route, Redirect} from 'react-router-dom';

import ChannelIssues from "../../components/Clients/Channels/ChannelIssues/ChannelIssues";
import ChannelsAutoSwitching from "../../components/Clients/Channels/ChannelsAutoSwitching/ChannelsAutoSwitching";
import ChannelsPoolSwitchLog from "../../components/Clients/Channels/ChannelsPoolSwitchLog/ChannelsPoolSwitchLog";
import ChannelRent from "../../components/Clients/Channels/ChannelRent/ChannelRent";
import ChannelWorkers from "../../components/Clients/Channels/ChannelWorkers/ChannelWorkers";
import ChannelWorkerDetail from "../../components/Clients/Channels/ChannelWorkers/ChannelWorkerDetail/ChannelWorkerDetail";
import ChannelConnectionLog from "../../components/Clients/Channels/ChannelConnectionLog/ChannelConnectionLog";
import ChannelDashboard from "../../components/Clients/Channels/ChannelDashboard/ChannelDashboard";
import ChannelsSettings from "../../components/Clients/Channels/ChannelsSettings/ChannelsSettings";

import {getChannelDetail} from "../../actions/channelsActions";
import Loader from "../../components/Loader/Loader";
import NoMatch from "../NoMatch/NoMatch";

class ChannelContainer extends Component {
    constructor(props) {
        super(props);
        const { match } = this.props;
        this.baseUrl = match.url[match.url.length - 1] == '/' ? match.url : match.url + '/';
        this.state = {
            notFound: false
        };
    }

    componentDidMount(){
        const {getChannelDetail, match:{params:{channel}}, clients:{client_detail:{id}}} = this.props;
        getChannelDetail(id, channel).then((res)=>{
            if(res.error && res.error.response && res.error.response.status === 404){
                this.setState({notFound: true});
            }
        });
    }

    componentWillUnmount(){
        this.props.channels.channel_detail = {};
    }

    render(){
        const {match, channels:{channel_detail}, clients:{client_detail}} = this.props;
        const {notFound} = this.state;
        let showAutoSwitch = client_detail.mode !== 'FM';
        if(notFound) return <NoMatch/>;
        return (
            <div>
                {channel_detail && channel_detail.name ?
                    <Switch>
                        <Route path={`${this.baseUrl }`} exact render={()=>(<Redirect to={`${this.baseUrl }channel-dashboard`} push/>)}/>

                        <Route path={`${match.url}/channel-dashboard`} exact component={ChannelDashboard}/>
                        <Route path={`${match.url}/channel-workers`} exact component={ChannelWorkers}/>
                        <Route path={`${match.url}/channel-workers/:worker`} exact component={ChannelWorkerDetail}/>
                        <Route path={`${match.url}/issues`} exact component={ChannelIssues}/>
                        <Route path={`${match.url}/connection-log`} exact component={ChannelConnectionLog}/>
                        <Route path={`${match.url}/rent`} exact component={ChannelRent}/>
                        {showAutoSwitch ?
                            <Route path={`${match.url}/auto-switching`} exact component={ChannelsAutoSwitching}/>
                            :
                            null
                        }
                        <Route path={`${match.url}/pool-switch-log`} exact component={ChannelsPoolSwitchLog}/>
                        <Route path={`${match.url}/channel-settings`} exact component={ChannelsSettings}/>

                        <Route component={NoMatch}/>
                    </Switch>
                    :
                    <Loader class="page"/>
                }
            </div>
        );
    }
}

ChannelContainer.contextTypes = {
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
        getChannelDetail
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelContainer);