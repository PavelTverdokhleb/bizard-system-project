import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Route,
    Switch,
    Redirect
} from 'react-router-dom';
import Dashboard from '../../components/Dashboard/Dashboard';
import Settings from '../../components/Settings/Settings';
import FinancialContainer from '../FinancialContainer/FinancialContainer';
import Clients from '../../components/Clients/Clients';
import EditClient from '../../components/Clients/EditClient/EditClient';
import ClientContainer from '../ClientContainer/ClientContainer';
import Header from '../../components/Header/Header';
import SideBar from '../../components/SideBar/SideBar';
import {getUser} from "../../actions/userActions";
import NoMatch from "../NoMatch/NoMatch";

class Container extends Component {
    constructor(props) {
        super(props);
        const { match } = this.props;
        this.baseUrl = match.url[match.url.length - 1] == '/' ? match.url : match.url + '/';
    }

    componentDidMount(){
        const {getUser, history, user:{user_info}} = this.props;
        if(!user_info && localStorage.token  || !user_info.name && localStorage.token ) {
            getUser().then(res=>{
                if(res.error && res.error.response) {
                    localStorage.clear();
                    history.push('/authentication');
                }
            });
        }
    }

    componentWillUnmount(){
        this.props.user.user_info = {};
        this.props.user.user_fetched = null;
    }

    render(){
        const { match, history, user:{user_info, user_fetched} } = this.props;
        return (
            <div>
                {!localStorage.token ? <Redirect to={'/authentication'} push/> : null}
                <Header history={history} />
                {user_fetched !== null && user_info.email ?
                    <div className="content_wrapper">
                        <SideBar url={match.url}/>
                        <div className="content_inner">
                            <Switch>
                                <Route path={`${this.baseUrl}`} exact render={()=>(<Redirect to={`${this.baseUrl}clients`} push/>)}/>

                                {/*<Route path={`${this.baseUrl}dashboard`} exact component={Dashboard}/>*/}

                                <Route path={`${match.url}/clients`} exact component={Clients}/>
                                <Route path={`${match.url}/clients/:id`} exact component={EditClient}/>
                                <Route path={`${match.url}/clients/:id/inner`} component={ClientContainer}/>
                                <Route path={`${this.baseUrl}financial-statistics`} component={FinancialContainer}/>
                                <Route path={`${this.baseUrl}settings`} exact component={Settings}/>

                                <Route component={NoMatch}/>
                            </Switch>
                        </div>
                    </div>
                    :
                    null
                }
                <div className="background_web"></div>
            </div>
        );
    }
}

Container.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

function mapStateToProps(state) {
    return{
        user: state.user
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getUser
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);