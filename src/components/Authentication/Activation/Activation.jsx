import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {postActivation} from "../../../actions/authenticationActions";
import {getError} from "../../../helpers/functions";
import {Link} from 'react-router-dom';
import AuthButton from "../../Buttons/AuthButton/AuthButton"
import Loader from '../../Loader/Loader';
import ArrowIcon from '../../../../assets/img/arrow.png';

class Activation extends Component {
    state = {
        loader: false,
        failed: false
    };

    componentWillMount(){
        const {match, postActivation, history} = this.props;
        if(match.params.code) {
            this.props.auth.error = [];
            let obj = {
                security_token: match.params.code
            };
            this.setState({loader: true});
            postActivation(obj).then((res)=>{
                this.setState({loader: false});
                if(res.payload && res.payload.status == 200 || res.payload && res.payload.status == 201){
                    history.push('/authentication');
                }
                else {
                    this.setState({failed: true});
                }
            });
        }
    }

    componentWillUnmount(){
        this.props.auth.error = [];
    }

    render(){
        const { match, auth:{error} } = this.props;
        const { loader, failed } = this.state;
        let code = !!match.params.code;
        return (
            <div className="form_container">
                {loader ?
                    <div className="auth-caption">
                        <Loader class="auth"/>
                    </div>
                    :
                    !failed ?
                        <div>
                            <div className="auth-caption">
                                <h2>Activate account</h2>
                                <h3>
                                    {code ?
                                        'Your account has been successfully activated. Now you can sign in'
                                        :
                                        'We have sent you an email with the link to activate your account'
                                    }
                                </h3>
                            </div>
                            {code ?
                                <AuthButton link>
                                    Sign in
                                </AuthButton>
                                :
                                ''
                            }
                        </div>
                        :
                        <div>
                            <div className="auth-caption">
                                <h2>Activate account</h2>
                            </div>
                            <div className="global-error">{error && error.length !== 0 ? getError(error) : ''}</div>
                            <Link to="/authentication">
                                <div className="auth_link return-link">
                                    <img src={ArrowIcon}/>
                                    <span className="return-link_content">Return to Sign In</span>
                                </div>
                            </Link>
                        </div>
                }
            </div>
        );
    }
}

Activation.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

function mapStateToProps(state) {
    return{
        auth: state.auth
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        postActivation
    }, dispatch);
}

export default  connect(mapStateToProps, mapDispatchToProps)(Activation);