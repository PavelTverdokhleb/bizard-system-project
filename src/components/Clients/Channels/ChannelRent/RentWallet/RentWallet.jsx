import React, {Component} from 'react';
import ActionButton from '../../../../Buttons/ActionButton/ActionButton';
import DialogComponent from "../../../../HelpersBlocks/DialogComponent/DialogComponent";
import RentWalletForm from './RentWalletForm/RentWalletForm';

import OperationSuccessIcon from '../../../../../../assets/img/operation_success.png';

class RentWallet extends Component {
    constructor(props){
        super(props);
        this.state = {
            success: false
        };
    }

    editSuccess = () => {
        this.setState({success: true});
    };

    dialogClose = () => {
        const {closeDialog} = this.props;
        closeDialog();
        setTimeout(()=>{this.setState({success: false})},0);
    };

    render(){
        const {open, address} = this.props;
        const {success} = this.state;
        return (
            <DialogComponent
                open={open}
                dialogClose={this.dialogClose}
            >
                {!success ?
                    <RentWalletForm
                        onClose={this.dialogClose}
                        onSuccess={this.editSuccess}
                        address={address}
                    />
                    :
                    <div className="dialog_switch_wrapper">
                        <img src={OperationSuccessIcon} alt="success_icon"/>
                        <p className="dialog_message">BTC wallet has been changed successfully</p>
                        <div className="btn_wrapper btn_wrapper_wide">
                            <ActionButton
                                text="Ok"
                                class="save"
                                full
                                action={this.dialogClose}
                            />
                        </div>
                    </div>
                }
            </DialogComponent>
        );
    }
}

export default (RentWallet);