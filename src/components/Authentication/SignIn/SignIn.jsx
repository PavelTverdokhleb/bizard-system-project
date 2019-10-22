import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { postSignIn } from "../../../actions/authenticationActions";
import {Link} from 'react-router-dom';
import {getError} from "../../../helpers/functions";
import {required, email, minLength} from "../../../helpers/validation"
import RenderField from '../../HelpersBlocks/RenderField/RenderField';
import AuthButton from '../../Buttons/AuthButton/AuthButton';
import Loader from '../../Loader/Loader';

class SignIn extends Component {
    state = {
        loader: false
    };

    componentWillMount() {
        sessionStorage.clear();
        localStorage.clear();
    }

    componentWillUnmount(){
        this.props.auth.error = [];
    }

    SubmitForm=(data)=>{
        const {postSignIn, history} = this.props;
        this.props.auth.error = [];
        this.setState({loader: true});
        let obj = {
            email: data.email,
            password: data.password
        };
        postSignIn(obj).then((res)=>{
            if(res.payload && res.payload.status && res.payload.status == 200 || res.payload && res.payload.status && res.payload.status == 201){
                sessionStorage.security_token = res.payload.data.security_token;
                history.push('/authentication/verification/');
            }
            else {
                this.setState({loader: false});
            }
        });
    };

    render(){
        const { handleSubmit, submitting, pristine, valid, auth:{error} } = this.props;
        const { loader } = this.state;
        return (
            <div className="form_container">
                <div className="auth-caption">
                    <h2>Sign In</h2>
                </div>
                <form onSubmit={handleSubmit(this.SubmitForm)}>
                    <Field name="email" type="text" classes="auth_input" component={RenderField} validate={[required, email]} placeholder="Email"/>
                    <Field name="password" type="password" classes="auth_input" component={RenderField} validate={[required, minLength(8)]} placeholder="Password"/>
                    <div className="reset_link">
                        <Link to="/authentication/password-recovery/first-step">Reset Password</Link>
                    </div>
                    {!loader ?
                        <AuthButton disabled={submitting || pristine || !valid}>
                            Sign In
                        </AuthButton>
                        :
                        <Loader class="auth"/>
                    }
                    <div className="global-error">{error && error.length !== 0 ? getError(error) : ''}</div>
                    <div className="auth_link">
                        <span>Don't have an account?</span>
                        <Link to="/authentication/sign-up">Sign up</Link>
                    </div>
                    <div className="auth_link">
                        <Link to="/contacts">Contacts</Link>
                    </div>
                    <div className="auth_link">
                        <a href="/assets/privacy_policy.pdf" target="_blank" rel="nofollow noopener">Privacy Policy</a>
                    </div>
                </form>
            </div>
        );
    }
}

SignIn.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

SignIn = reduxForm({
    form: 'SignIn'
})(SignIn);

function  mapStateToProps(state) {
    return{
        auth: state.auth,
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        postSignIn
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);