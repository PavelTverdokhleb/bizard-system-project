import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import {postRecoverThirdStep} from "../../../../actions/authenticationActions";
import {getError} from "../../../../helpers/functions";
import {required, minLength} from "../../../../helpers/validation";
import RenderField from "../../../HelpersBlocks/RenderField/RenderField";
import AuthButton from "../../../Buttons/AuthButton/AuthButton";
import Loader from '../../../Loader/Loader';


class ThirdStep extends Component {
    state = {
        loader: false
    };

    componentWillUnmount(){
        this.props.auth.error=[];
    }

    SubmitForm=(data)=>{
        const {postRecoverThirdStep, history} = this.props;
        this.setState({loader: true});
        this.props.auth.error=[];
        let obj = {
            confirm_password: data.confirm_password,
            new_password: data.new_password,
            security_token: sessionStorage.security_token
        };
        postRecoverThirdStep(obj).then((res)=>{
            if(res.payload && res.payload.status == 200 || res.payload && res.payload.status == 201){
                localStorage.clear();
                sessionStorage.clear();
                history.push('/authentication/password-recovery/complete');
            }
            else {
                this.setState({loader: false});
            }
        })
    };

    render(){
        const { handleSubmit, submitting, pristine, valid, auth:{error}} = this.props;
        const { loader } = this.state;
        return (
            <div className="form_container">
                <div className="auth-caption">
                    <h2>Password recovery</h2>
                    <h3>Enter and confirm your new password</h3>
                </div>
                <form onSubmit={handleSubmit(this.SubmitForm)}>
                    <Field name="new_password" type="password" classes="auth_input" component={RenderField} validate={[required, minLength(8)]} placeholder="New Password"/>
                    <Field name="confirm_password" type="password" classes="auth_input" component={RenderField} validate={[required, minLength(8)]} placeholder="Confirm Password"/>
                    {!loader ?
                        <AuthButton disabled={submitting || pristine || !valid}>
                            Save
                        </AuthButton>
                        :
                        <Loader class="auth"/>
                    }
                    <div className="global-error">{error && error.length !== 0 ? getError(error) : ''}</div>
                </form>
            </div>
        );
    }
}

const validate = values => {
    const errors = {};
    if (values.new_password !== values.confirm_password) {
        errors.confirm_password = 'Passwords do not match'
    }
    return errors
};

ThirdStep.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

ThirdStep = reduxForm({
    form: 'ThirdStep',
    validate
})(ThirdStep);

function mapStateToProps(state) {
    return{
        auth: state.auth,
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        postRecoverThirdStep
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ThirdStep);