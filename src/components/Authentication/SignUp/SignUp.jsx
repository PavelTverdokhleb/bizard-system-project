import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {postSignUp} from "../../../actions/authenticationActions";
import {required, email, minLength} from "../../../helpers/validation";
import RenderField from '../../HelpersBlocks/RenderField/RenderField';
import AuthButton from '../../Buttons/AuthButton/AuthButton';
import Loader from '../../Loader/Loader';

class SignUp extends Component {
    state = {
        loader: false
    };

    SubmitForm=(data)=>{
        const {postSignUp, history} = this.props;
        this.setState({loader: true});
        let obj = {
            name: data.name,
            phone: data.phone.indexOf('+') === 0 ? data.phone : '+'+data.phone,
            email: data.email,
            password: data.password,
            confirm_password: data.confirm_password
        };

        return postSignUp(obj).then((res)=>{
            if(res.payload && res.payload.status == 200 || res.payload && res.payload.status == 201){
                history.push('/authentication/activation');
            }
            else {
                this.setState({loader: false});
                throw new SubmissionError({...res.error.response.data,_error: 'Create VerifyFailed.'});
            }
        })
    };

    render(){
        const { handleSubmit, submitting, pristine, valid, error} = this.props;
        const { loader } = this.state;
        return (
            <div className="form_container">
                <div className="auth-caption">
                    <h2>Create a new account</h2>
                </div>
                <form onSubmit={handleSubmit(this.SubmitForm)}>
                    <Field name="name" type="text" classes="auth_input" component={RenderField} validate={[required]} placeholder="Company Name"/>
                    <Field name="phone" type="number" classes="auth_input" component={RenderField} validate={[required]} placeholder="Phone Number"/>
                    <Field name="email" type="text" classes="auth_input" component={RenderField} validate={[required, email]} placeholder="Email"/>
                    <Field name="password" type="password" classes="auth_input" component={RenderField} validate={[required, minLength(8)]} placeholder="Password"/>
                    <Field name="confirm_password" type="password" classes="auth_input" component={RenderField} validate={[required, minLength(8)]} placeholder="Confirm Password"/>
                    {!loader ?
                        <AuthButton disabled={submitting || pristine || !valid}>
                            Create
                        </AuthButton>
                        :
                        <Loader class="auth"/>
                    }
                    <div className="global-error">{error && error !== '' ? <p>{error}</p> : ''}</div>
                    <div className="auth_link">
                        <Link to="/authentication">I already have an account</Link>
                    </div>
                </form>
            </div>
        );
    }
}

const validate = values => {
    const errors = {};
    if (values.password !== values.confirm_password) {
        errors.confirm_password = 'Passwords do not match'
    }
    return errors
};

SignUp.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

SignUp = reduxForm({
    form: 'SignUp',
    validate
})(SignUp);

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        postSignUp
    }, dispatch);
}

export default connect(null, mapDispatchToProps)(SignUp);