import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {Field, reduxForm, SubmissionError} from 'redux-form';
import IconButton from '@material-ui/core/IconButton';
import ActionButton from '../../../../../Buttons/ActionButton/ActionButton';
import {required} from "../../../../../../helpers/validation";
import RenderField from "../../../../../HelpersBlocks/RenderField/RenderField";

import {patchEditChannel} from "../../../../../../actions/channelsActions";
import {updateRent} from "../../../../../../actions/updateRedux";

import CloseDialogIcon from '../../../../../../../assets/img/close_dialog_icon.png';
import ErrorIcon from '../../../../../../../assets/img/error_icon.png';

import './RentWalletForm.scss';


class RentWalletForm extends Component {

    SubmitForm=(data)=>{
        const {patchEditChannel, updateRent, onSuccess, clients:{client_detail}, address, channels:{channel_detail}} = this.props;
        let obj = {
            change_wallet_code: data.change_wallet_code,
            rent_specific_address: address
        };
        return patchEditChannel(client_detail.id, channel_detail.id, obj).then((res)=>{
            if(res.payload && res.payload.status && res.payload.status === 200){
                this.setState({success: true});
                let objUpdate = {
                    field_wallet_to_use: 'rent_wallet_to_use',
                    field_wallet_to_use_value: 'specific',
                    field_specific_address: 'rent_specific_address',
                    field_specific_address_value: address
                };
                updateRent(objUpdate);
                setTimeout(()=>{onSuccess()}, 0);
            }
            else {
                throw new SubmissionError({...res.error.response.data});
            }
        });
    };

    render(){
        const { handleSubmit, submitting, pristine, error, onClose } = this.props;
        return (
            <form onSubmit={handleSubmit(this.SubmitForm)}>
                <div className="dialog_rent_wallet_wrapper">
                    <div className="close_btn_dialog">
                        <IconButton
                            onClick={onClose}>
                            <img src={CloseDialogIcon} alt="close_icon"/>
                        </IconButton>
                    </div>
                    <h2 className="rent_wallet_header">Change BTC Wallet</h2>
                    <p className="dialog_message">To confirm your new wallet enter the code we’ve sent to your email</p>
                    <div className="btn_wrapper_wide">
                        <Field
                            name="change_wallet_code"
                            type="number"
                            classes="edit_input full_width_text_field"
                            component={RenderField}
                            autoFocus
                            validate={[required]}
                            label="Code"
                        />
                    </div>
                    <div className="btn_wrapper btn_wrapper_wide">
                        <ActionButton
                            text="Confirm"
                            class="save"
                            disabled={submitting || pristine}
                            full
                            formAction
                        />
                    </div>
                    {error !== undefined ? <p className="page_error"><img src={ErrorIcon} alt="icon"/>{error}</p> : null}
                </div>
            </form>
        );
    }
}

RentWalletForm = reduxForm({
    form: 'RentWalletForm',
})(RentWalletForm);

function mapStateToProps(state) {
    return{
        clients: state.clients,
        channels: state.channels
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        patchEditChannel,
        updateRent
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RentWalletForm);