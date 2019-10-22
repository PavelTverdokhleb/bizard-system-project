import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {postConfirm, postResend} from "../../../actions/authenticationActions";
import RenderField from '../../HelpersBlocks/RenderField/RenderField';
import AuthButton from '../../Buttons/AuthButton/AuthButton';
import Loader from '../../Loader/Loader';
import {getError} from "../../../helpers/functions";

class Confirm extends Component {
    state = {
        loader: false,
        disabled: false
    };

    componentWillUnmount(){
        this.props.auth.error = [];
    }

    SubmitForm=(data)=>{
        const {postConfirm, history} = this.props;
        this.setState({loader: true});
        this.props.auth.error = [];
        let obj = {
            code: data.code
        };
        postConfirm(obj).then((res)=>{
            if(res.payload && res.payload.status && res.payload.status == 200 || res.payload && res.payload.status && res.payload.status == 201){
                sessionStorage.clear();
                localStorage.token = res.payload.data.token;
                history.push('/');
            }
            else {
                this.setState({loader: false});
            }
        });
    };

    resendForm=()=>{
        const {postResend, history} = this.props;
        if(sessionStorage.security_token){
            this.props.auth.error = [];
            this.setState({disabled: true});
            let obj = {
                security_token: sessionStorage.security_token
            };
            postResend(obj, 'signin').then(()=>{
                this.setState({disabled: false});
            });
        }
        else {
            history.push('/authentication');
        }
    };

    render(){
        const { handleSubmit, submitting, pristine, auth:{error} } = this.props;
        const { loader, disabled } = this.state;
        return (
            <div className="form_container">
                <div className="auth-caption">
                    <h2>Sign In</h2>
                    <h3>We have sent you a code to your email</h3>
                </div>
                <form onSubmit={handleSubmit(this.SubmitForm)}>
                    <Field name="code" type="number" classes="auth_input" component={RenderField} placeholder="Code"/>
                    {!loader ?
                        <AuthButton disabled={submitting || pristine}>
                            Sign In
                        </AuthButton>
                        :
                        <Loader class="auth"/>
                    }
                    <div className="global-error">{error && error.length !== 0 ? getError(error) : ''}</div>
                    <div className="auth_link">
                        <span>Did not receive code?</span>
                        <button type="button" disabled={disabled} onClick={this.resendForm}>Send again</button>
                    </div>
                </form>
            </div>
        );
    }
}

Confirm.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

Confirm = reduxForm({
    form: 'ConfirmForm'
})(Confirm);

function mapStateToProps(state) {
    return{
        auth: state.auth
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        postConfirm,
        postResend
    }, dispatch);
}

export default  connect(mapStateToProps, mapDispatchToProps)(Confirm);