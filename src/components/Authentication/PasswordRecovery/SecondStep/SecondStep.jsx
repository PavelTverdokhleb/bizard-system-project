import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import ArrowIcon from '../../../../../assets/img/arrow.png';

class SecondStep extends Component {
    componentWillMount(){
        const {match, history} = this.props;
        if(match.params.code) {
            sessionStorage.security_token = match.params.code;
            history.push('/authentication/password-recovery/third-step');
        }
    }

    render(){
        return (
            <div className="form_container">
                <div>
                    <div className="auth-caption">
                        <h2>Password recovery</h2>
                        <h3>We have sent you a link for password recovery to your email</h3>
                    </div>
                    <Link to="/authentication">
                        <div className="auth_link return-link">
                            <img src={ArrowIcon}/>
                            <span className="return-link_content">Return to Sign In</span>
                        </div>
                    </Link>
                </div>
            </div>
        );
    }
}

SecondStep.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

export default connect(null, null)(SecondStep);