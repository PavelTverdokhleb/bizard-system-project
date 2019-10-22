import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {getError} from "../../../helpers/functions";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ActionButton from '../../Buttons/ActionButton/ActionButton';
import DialogComponent from '../../HelpersBlocks/DialogComponent/DialogComponent';

import {updateClient, updateClientDetail} from "../../../actions/updateRedux";
import {postInviteClient} from "../../../actions/clientsActions";

import AddIcon from '@material-ui/icons/Add';
import CloseDialogIcon from '../../../../assets/img/close_dialog_icon.png';
import KonvertIcon from '../../../../assets/img/konvertik.png';
import PlusIcon from '../../../../assets/img/plusik.png';
import SuccessIcon from '../../../../assets/img/galochka.png';

class SendInvite extends Component {
    state = {
        open: false,
        success: false,
        loading: false
    };

    dialogClose = () => {
        this.props.clients.clients_action_error = [];
        this.setState({
            open: false
        });
    };

    inviteClient = () => {
        this.setState({
            open: true,
            success: false
        });
    };

    inviteClientSend = () => {
        const {postInviteClient, id} = this.props;
        this.setState({loading: true});
        postInviteClient(id).then((res)=>{
            this.setState({loading: false});
            if(res.payload && res.payload.status && res.payload.status === 200){
                this.setState({success: true});
            }
        });
    };

    finishInvite = () => {
        const {updateClient, updateClientDetail, id, clients:{client_detail}} = this.props;
        if(client_detail.id === id){
            let obj = {
                ...client_detail
            };
            obj.status = 'invited';
            updateClientDetail(obj);
        }
        else {
            let obj = {
                id,
                value: 'invited',
                field: 'status'
            };
            updateClient(obj)
        }
        this.setState({open: false});

    };

    render(){
        const {name, clients:{clients_action_error}} = this.props;
        const {open, loading, success} = this.state;
        return (
            <div className="page_send_btn">
                <Button variant="outlined" onClick={this.inviteClient}>
                    <AddIcon/>
                    Send Invite
                </Button>
                <DialogComponent
                    open={open}
                    dialogClose={loading || success ? null : this.dialogClose}
                >
                    <div className="dialog_delete_wrapper">
                        {success ?
                            null
                            :
                            <div className="close_btn_dialog">
                                <IconButton
                                    disabled={loading}
                                    onClick={this.dialogClose}
                                >
                                    <img src={CloseDialogIcon} alt="close_icon"/>
                                </IconButton>
                            </div>
                        }
                        <div className="image_dialog_wrapper">
                            <img src={KonvertIcon}/>
                            <div className={loading ? "load_invite invite_loader_wrapper" : "invite_loader_wrapper"}>
                                {success ?
                                    <img src={SuccessIcon}/>
                                    :
                                    <img src={PlusIcon}/>
                                }
                            </div>
                        </div>
                        <p className="dialog_message">
                            {success ?
                                'Your invitation has been successfully sent'
                                :
                                `Send invitation to «${name}»`
                            }
                        </p>
                        <div className="btn_wrapper btn_wrapper_wide">
                            {success ?
                                <ActionButton
                                    text="Ok"
                                    class="save"
                                    type="button"
                                    full={true}
                                    action={this.finishInvite}
                                />
                                :
                                <ActionButton
                                    text="Confirm"
                                    class="save"
                                    type="button"
                                    full={true}
                                    disabled={loading}
                                    action={this.inviteClientSend}
                                />
                            }
                        </div>
                        {clients_action_error.length !== 0 ? <div className="global-error_form">{getError(clients_action_error)}</div> : null}
                    </div>
                </DialogComponent>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return{
        clients: state.clients,
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateClient,
        updateClientDetail,
        postInviteClient
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SendInvite);