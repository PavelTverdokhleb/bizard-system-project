import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {Link} from 'react-router-dom';
import {postRecoverFirstStep} from "../../../../actions/authenticationActions";
import {getError} from "../../../../helpers/functions";
import {email} from "../../../../helpers/validation";
import RenderField from '../../../HelpersBlocks/RenderField/RenderField';
import AuthButton from '../../../Buttons/AuthButton/AuthButton';
import ArrowIcon from '../../../../../assets/img/arrow.png';
import Loader from '../../../Loader/Loader';

class FirstStep extends Component {
    state = {
        loader: false
    };

    componentWillMount() {
        sessionStorage.clear();
    }

    componentWillUnmount(){
        this.props.auth.error=[];
    }

    SubmitForm=(data)=>{
        const {postRecoverFirstStep, history} = this.props
        this.props.auth.error=[];
        this.setState({loader: true});
        let obj = {
            email: data.email
        };
        postRecoverFirstStep(obj).then((res)=>{
            if(res.payload && res.payload.status == 200 || res.payload && res.payload.status == 201){
                sessionStorage.security_token = res.payload.data.security_token;
                history.push('/authentication/password-recovery/second-step');
            }
            else {
                this.setState({loader: false});
            }
        });
    };

    render(){
        const { handleSubmit, submitting, pristine, valid, auth:{error}} = this.props;
        const { loader } = this.state;
        return (
            <div className="form_container">
                <div className="auth-caption">
                    <h2>Password recovery</h2>
                    <h3>To reset your password enter your email address</h3>
                </div>
                <form onSubmit={handleSubmit(this.SubmitForm)}>
                    <Field name="email" type="text" classes="auth_input" component={RenderField} validate={[email]} placeholder="Email"/>
                    {!loader ?
                        <AuthButton disabled={submitting || pristine || !valid}>
                            Recover
                        </AuthButton>
                        :
                        <Loader class="auth"/>
                    }
                    <div className="global-error">{error && error.length !== 0 ? getError(error) : ''}</div>
                    <Link to="/authentication">
                        <div className="auth_link return-link">
                            <img src={ArrowIcon}/>
                            <span className="return-link_content">Return to Sign In</span>
                        </div>
                    </Link>
                </form>
            </div>
        );
    }
}

FirstStep.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

FirstStep = reduxForm({
    form: 'FirstStep'
})(FirstStep);

function mapStateToProps(state) {
    return{
        auth: state.auth
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        postRecoverFirstStep
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FirstStep);