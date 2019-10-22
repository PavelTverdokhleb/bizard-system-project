import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {Switch, Route, Redirect} from 'react-router-dom';

import ClientSettings from "../../components/Clients/ClientSettings/ClientSettings";
import Channels from "../../components/Clients/Channels/Channels";
import EditPool from "../../components/Clients/EditPool/EditPool";
import Pools from "../../components/Clients/Pools/Pools";
import EditChannel from "../../components/Clients/EditChannel/EditChannel";
import Finances from "../../components/Clients/Finances/Finances";
import ChannelContainer from "../ChannelContainer/ChannelContainer";

import {getClientDetail} from "../../actions/clientsActions";
import Loader from "../../components/Loader/Loader";
import NoMatch from "../NoMatch/NoMatch";

class ClientContainer extends Component {
    constructor(props) {
        super(props);
        const { match } = this.props;
        this.baseUrl = match.url[match.url.length - 1] == '/' ? match.url : match.url + '/';
        this.state = {
            notFound: false
        };
    }

    componentDidMount(){
        const {getClientDetail, match:{params}} = this.props;
        getClientDetail(params.id).then((res)=>{
            if(res.error && res.error.response && res.error.response.status === 404){
                this.setState({notFound: true});
            }
        });
    }

    componentWillUnmount(){
        this.props.clients.client_detail = {};
    }

    render(){
        const {match, clients:{client_detail}} = this.props;
        const {notFound} = this.state;
        if(notFound) return <NoMatch/>;
        return (
            <div>
                {client_detail && client_detail.name ?
                    <Switch>
                        <Route path={`${this.baseUrl}`} exact render={()=>(<Redirect to={`${this.baseUrl}channels`} push/>)}/>
                        <Route path={`${match.url}/channels`} exact component={Channels}/>
                        <Route path={`${match.url}/channels/:channel`} exact component={EditChannel}/>
                        <Route path={`${match.url}/channels/:channel/channel-inner`} component={ChannelContainer}/>

                        {/*<Route path={`${match.url}/finances`} exact component={Finances}/>*/}

                        <Route path={`${match.url}/pools`} exact render={()=>(<Redirect to={`${match.url}/pools/SHA-256`} push/>)}/>
                        <Route path={`${match.url}/pools/:algorithm`} exact component={Pools}/>
                        <Route path={`${match.url}/pools/:algorithm/:pool`} exact component={EditPool}/>

                        <Route path={`${match.url}/settings`} exact component={ClientSettings}/>

                        <Route component={NoMatch}/>
                    </Switch>
                    :
                    <Loader class="page"/>
                }
            </div>
        );
    }
}

ClientContainer.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

function mapStateToProps(state) {
    return{
        clients: state.clients,
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getClientDetail
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ClientContainer);