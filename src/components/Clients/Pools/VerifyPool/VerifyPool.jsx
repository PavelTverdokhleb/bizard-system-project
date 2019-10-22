import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, formValueSelector, SubmissionError } from 'redux-form';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionButton from '../../../Buttons/ActionButton/ActionButton';
import RenderField from "../../../HelpersBlocks/RenderField/RenderField";
import {required} from "../../../../helpers/validation";
import VerifySuccess from './VerifySuccess/VerifySuccess';
import VerifyFailed from './VerifyFailed/VerifyFailed';
import Loader from "../../../Loader/Loader";
import {poolAddress} from "../../../../helpers/normalize";
import {postVerify} from "../../../../actions/poolsActions";
import ErrorIcon from '../../../../../assets/img/error_icon.png';

import './VerifyPool.scss';

class VerifyPool extends Component {
    state = {
        success: false,
        successData: null,
        failed: false,
        failedData: null,
        loading: false
    };

    SubmitForm=(data)=>{
        const {postVerify} = this.props;
        this.setState({loading: true});
        return postVerify(data).then(res=>{
            if(res.payload && res.payload.status && res.payload.status === 200){
                let {validation_list} = res.payload.data;
                let err = false;
                validation_list.map((e,i)=>{
                    if(e.result !== "OK") err = true
                });
                if(!err) {
                    this.setState({success: true, successData: validation_list, loading: false});
                }
                else{
                    this.setState({failed: true, failedData: validation_list, loading: false});
                }
            }
            else {
                this.setState({loading: false});
                throw new SubmissionError({...res.error.response.data, _error: res.error.response.data.detail ? res.error.response.data.detail : 'Verify failed.'});
            }
        });
    };

    render(){
        const { handleSubmit, submitting, closeAction, data, algorithm, error } = this.props;
        const {success, failed, successData, failedData, loading} = this.state;
        if(loading) return <div className="dialog_verify_loader"><Loader class="btn"/></div>;
        return (
            <div>
                {success ?
                    <VerifySuccess
                        pool={data}
                        data={successData}
                        algorithm={algorithm}
                        close={closeAction}
                    />
                    :
                    failed ?
                        <VerifyFailed
                            pool={data}
                            data={failedData}
                            algorithm={algorithm}
                            close={closeAction}
                        />
                        :
                        <form onSubmit={handleSubmit(this.SubmitForm)}>
                            <div className="verify_pool_wrapper">
                                <div className="verify_fields_wrapper">
                                    <h2 className="form_header">Verify pool</h2>
                                    <Field
                                        name="pool"
                                        type="text"
                                        classes="edit_input full_width_text_field pre_label_pool_address"
                                        component={RenderField}
                                        label="Pool Address"
                                        preLabel="stratum+tcp://"
                                        validate={[required]}
                                        normalize={poolAddress}
                                    />
                                    <Field
                                        name="username"
                                        type="text"
                                        classes="edit_input full_width_text_field"
                                        component={RenderField}
                                        label="User Name/Wallet"
                                        validate={[required]}
                                    />
                                    <div className="double_fields_wrapper">
                                        <Field
                                            name="port"
                                            type="text"
                                            classes="edit_input half_width_text_field"
                                            component={RenderField} label="Pool Port"
                                            validate={[required]}
                                        />
                                        <Field
                                            name="password"
                                            type="text"
                                            classes="edit_input half_width_text_field"
                                            component={RenderField}
                                            label="Password"
                                        />
                                    </div>
                                </div>
                                <div className="verify_buttons_wrapper">
                                    <ActionButton
                                        text="cancel"
                                        class="cancel"
                                        type="button"
                                        action={closeAction}
                                    />
                                    <ActionButton
                                        text="verify"
                                        class="verify"
                                        type="button"
                                        disabled={submitting}
                                        formAction
                                    />
                                    {error !== undefined ?
                                        <p className="page_error"><img src={ErrorIcon} alt="icon"/>{error}</p> : null}
                                </div>
                            </div>
                        </form>
                }
            </div>
        );
    }
}

VerifyPool.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

VerifyPool = reduxForm({
    form: 'VerifyPool',
    enableReinitialize: true
})(VerifyPool);

const selector = formValueSelector('VerifyPool');

function mapStateToProps(state, props) {
    let obj = props.data;
    return{
        initialValues: {
            pool:  obj.host || '',
            username:  obj.username || '',
            port:  obj.port || '',
            password:  obj.password || '',
        },
        data: selector(state, 'pool', 'port', 'username', 'password'),
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        postVerify
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(VerifyPool);