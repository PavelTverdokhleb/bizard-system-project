import React, {Component} from 'react';
import {
    Route,
    Switch,
    Redirect
} from 'react-router-dom';
import NoMatch from '../NoMatch/NoMatch';
import SignIn from '../../components/Authentication/SignIn/SignIn';
import Confirm from '../../components/Authentication/Confirm/Confirm';
import Activation from '../../components/Authentication/Activation/Activation';
import SignUp from '../../components/Authentication/SignUp/SignUp';
import FirstStep from '../../components/Authentication/PasswordRecovery/FirstStep/FirstStep';
import SecondStep from '../../components/Authentication/PasswordRecovery/SecondStep/SecondStep';
import ThirdStep from '../../components/Authentication/PasswordRecovery/ThirdStep/ThirdStep';
import CompleteRecovery from '../../components/Authentication/PasswordRecovery/CompleteRecovery/CompleteRecovery';
import Logo from '../../components/Logo/Logo';
import './Authentication.scss';


class Authentication extends Component {
    constructor(props) {
        super(props);
        const { match } = this.props;
        this.baseUrl = match.url[match.url.length - 1] == '/' ? match.url : match.url + '/';
    }

    render(){
        const { match } = this.props;
        return (
            <div className="authentication_wrapper">
                <div className="authentication_box">
                    <Logo/>
                    {localStorage.token ?
                        <Redirect to="/" push />
                        :
                        <Switch>
                            <Route path={ this.baseUrl } exact component={SignIn}/>
                            <Route exact path={`${match.url}/verification`} component={Confirm}/>
                            <Route exact path={`${match.url}/sign-up`} component={SignUp}/>
                            <Route exact path={`${match.url}/activation`} component={Activation}/>
                            <Route exact path={`${match.url}/activation/:code`} component={Activation}/>
                            <Route exact path={`${match.url}/password-recovery/first-step`} component={FirstStep}/>
                            <Route exact path={`${match.url}/password-recovery/second-step`} component={SecondStep}/>
                            <Route exact path={`${match.url}/password-recovery/second-step/:code`} component={SecondStep}/>
                            <Route exact path={`${match.url}/password-recovery/third-step`} component={ThirdStep}/>
                            <Route exact path={`${match.url}/password-recovery/complete`} component={CompleteRecovery}/>
                            <Route component={NoMatch}/>
                        </Switch>
                    }
                </div>
            </div>
        );
    }
}

export default Authentication;