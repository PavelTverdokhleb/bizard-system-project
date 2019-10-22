import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogComponent from '../../../HelpersBlocks/DialogComponent/DialogComponent';
import ActionButton from '../../../Buttons/ActionButton/ActionButton';
import TooltipMessage from '../../../HelpersBlocks/TooltipMessage/TooltipMessage';

import {patchEditPool} from "../../../../actions/poolsActions";
import {updatePool} from "../../../../actions/updateRedux";

import SuccessIcon from '../../../../../assets/img/operation_success.png';
import ErrorIcon from '../../../../../assets/img/error_icon.png';

class MakePrimary extends Component {
    state = {
        loading: false,
        open: false,
        error: null,
        data: null
    };

    makePrimary = () => {
        const {patchEditPool, client_id, id} = this.props;
        let obj = {
            primary: true
        };
        this.setState({loading: true});
        patchEditPool(client_id, id, obj).then(res=>{
            if(res.payload && res.payload.status && res.payload.status === 200){
                this.dialogChange();
                this.setState({data: res.payload.data});
            }
            else {
                this.setState({error: res.error.response.data, loading: false});
            }
        })
    };

    success = () => {
        const {updatePool} = this.props;
        const {data} = this.state;
        this.setState({loading: false});
        updatePool(data);
    };

    dialogChange = () => {
        this.setState({open: true});
    };

    render(){
        const {name, currency} = this.props;
        const {loading, open, error} = this.state;
        return (
            <div className={loading ? "flex-center destination_load" : null}>
                {loading ?
                    <CircularProgress size={20} thickness={3}/>
                    :
                    error === null ?
                        <p className="gray_text">
                            <button className="underline_btn_table" onClick={this.makePrimary}>
                                Make primary
                            </button>
                        </p>
                        :
                        <p className="destination_error_wrapper">
                            <TooltipMessage error text={error.primary ? error.primary : 'Make primary failed.'}>
                                <img src={ErrorIcon} alt="error"/>
                            </TooltipMessage>
                        </p>
                }
                <DialogComponent
                    open={open}
                    dialogClose={this.success}
                >
                    <div className="dialog_delete_wrapper">
                        <img src={SuccessIcon}/>
                        <p className="dialog_message">{`Pool «${name}» set as primary for ${currency}`}</p>
                        <div className="btn_wrapper btn_wrapper_wide">
                            <ActionButton
                                text="Ok"
                                class="save"
                                type="button"
                                full
                                action={this.success}
                            />
                        </div>
                    </div>
                </DialogComponent>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        patchEditPool,
        updatePool
    }, dispatch);
}

export default connect(null, mapDispatchToProps)(MakePrimary);