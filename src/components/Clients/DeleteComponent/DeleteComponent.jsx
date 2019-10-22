import React, {Component} from 'react';
import IconButton from '@material-ui/core/IconButton';
import ActionButton from '../../Buttons/ActionButton/ActionButton';
import DialogComponent from '../../HelpersBlocks/DialogComponent/DialogComponent';
import TooltipMessage from '../../HelpersBlocks/TooltipMessage/TooltipMessage';

import CloseIconDialog from '../../../../assets/img/close_icon_dialog.png';

class DeleteComponent extends Component {
    state = {
        open: false,
        loading: false
    };

    dialogClose= () => {
        this.setState({
            open: false
        });
    };

    delete = () => {
        this.setState({
            open: true
        });
    };

    deleteSend = () => {
        const {onDelete, onRemove, id, redirect, request, history} = this.props;
        let obj = {
            id
        };
        this.setState({loading: true});
        onDelete(id).then((res)=>{
            this.setState({loading: false});
            if(res.payload && res.payload.status && res.payload.status === 204){
                this.setState({open: false});
                onRemove ?  onRemove(obj) : null;
                redirect ? history.push(redirect) : null;
                request ? request() : null;
            }
        });
    };

    render(){
        const {text, icon, type, tooltip, disabled = false} = this.props;
        const {open, loading} = this.state;
        return (
            <div>
                {type === 'icon' ?
                    <TooltipMessage text={tooltip}>
                        <IconButton onClick={this.delete}>
                            <img src={icon} alt="delete_icon"/>
                        </IconButton>
                    </TooltipMessage>
                    :
                    <ActionButton
                        text={type}
                        class="terminate"
                        type="button"
                        action={this.delete}
                        disabled={disabled}
                    />
                }

                <DialogComponent
                    open={open}
                    dialogClose={!loading ? this.dialogClose : null}
                >
                    <div className="dialog_delete_wrapper">
                        <img src={CloseIconDialog}/>
                        <div>
                            <p className="dialog_message">{text}</p>
                        </div>
                        <div className="btn_wrapper">
                            <ActionButton
                                text="No"
                                class="cancel"
                                type="button"
                                disabled={loading}
                                action={this.dialogClose}
                            />
                            <ActionButton
                                text="Yes"
                                class="save"
                                type="button"
                                disabled={loading}
                                action={this.deleteSend}
                            />
                        </div>
                    </div>
                </DialogComponent>
            </div>
        );
    }
}

export default (DeleteComponent);