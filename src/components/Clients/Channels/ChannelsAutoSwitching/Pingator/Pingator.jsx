import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import SwitchedComponent from '../../../../SwitchComponent/SwitchComponent';
import DialogComponent from '../../../../HelpersBlocks/DialogComponent/DialogComponent';
import ActionButton from '../../../../Buttons/ActionButton/ActionButton';
import RenderField from '../../../../HelpersBlocks/RenderField/RenderField';
import {required, integerNumber, minAmount} from "../../../../../helpers/validation";
import {balanceTopUp} from "../../../../../helpers/normalize";

import {patchEditChannel} from "../../../../../actions/channelsActions";
import {updateAutoSwitch} from "../../../../../actions/updateRedux";

class Pingator extends Component {
    constructor(props){
        super(props);
        this.state = {
            pingSwitch: props.ping,
            openPingOn: false,
            openPingOff: false
        };
    }

    changePingSwitch = () => {
        const {pingSwitch} = this.state;
        if(pingSwitch) {
            let objSend = {
                ping: false,
            };
            let objUpdate = {
                field_switch: 'ping',
                field_switch_value: false
            };
            this.switchConfirm(false, objSend, objUpdate);
        }
        else {
            this.setState({ openPingOn: true });
        }
    };

    switchConfirm = (status, objSend, objUpdate) => {
        const {patchEditChannel, updateAutoSwitch, ids} = this.props;
        this.setState({loading: true});
        patchEditChannel(ids[0], ids[1], objSend).then(res=>{
            if(res.payload && res.payload.status && res.payload.status === 200) {
                updateAutoSwitch(objUpdate);
                if(status) {
                    this.setState({
                        pingSwitch: status,
                        loading: false,
                        openPingOn: false
                    });
                }
                else {
                    this.setState({
                        pingSwitch: status,
                        loading: false,
                        openPingOff: true
                    });
                }
            }
            else {
                this.setState({loading: false});
            }
        });
    };

    SubmitForm = (data) => {
        let objSend = {
            ping_time: Number(data.ping_time),
            ping: true
        };
        let objUpdate = {
            field_switch: 'ping',
            field_switch_value: true,
            field_switch_min: 'ping_time',
            field_switch_min_value: Number(data.ping_time)
        };
        this.switchConfirm(true, objSend, objUpdate);
    };

    dialogClose = () => {
        this.setState({
            openPingOn: false,
            openPingOff: false,
        });
    };

    render(){
        const {handleSubmit, auto_switch, ping_time, name} = this.props;
        const {pingSwitch, openPingOn, openPingOff} = this.state;
        return (
            <div className="auto_block_white">
                <div className="auto_switch_text_wrapper">
                    <p className="switch_option_text">Ping me on profitability change</p>
                    {pingSwitch ?
                        <p className="switch_option_small_text auto_small_text">Notify me, if the coin on top for more than {ping_time} minutes</p>
                        :
                        null
                    }
                </div>
                <SwitchedComponent
                    switched={pingSwitch}
                    onSwitch={this.changePingSwitch}
                    disabled={auto_switch}
                />

                <DialogComponent
                    open={openPingOn}
                    dialogClose={this.dialogClose}
                >
                    <div className="dialog_switch_wrapper dialog_auto_wrapper">
                        <SwitchedComponent
                            switched={true}
                            bigSize
                        />
                        <p className="dialog_message">Do you want us to send you a push notification to your mobile app as this coin stays on top of the rating for X minutes?</p>
                        <form onSubmit={handleSubmit(this.SubmitForm)}>
                            <Field
                                name="ping_time"
                                type="text"
                                classes="edit_input field_symbol_wrapper full_width_text_field"
                                component={RenderField}
                                symbol="MIN"
                                label="Enter the X value"
                                validate={[required, integerNumber, minAmount(1)]}
                                normalize={balanceTopUp}
                            />
                            <div className="btn_wrapper">
                                <ActionButton
                                    text="No"
                                    class="cancel"
                                    type="button"
                                    action={this.dialogClose}
                                />
                                <ActionButton
                                    text="Yes"
                                    class="save"
                                    type="button"
                                    formAction
                                />
                            </div>
                        </form>
                    </div>
                </DialogComponent>
                <DialogComponent
                    open={openPingOff}
                    dialogClose={this.dialogClose}
                >
                    <div className="dialog_switch_wrapper">
                        <SwitchedComponent
                            switched={false}
                            bigSize
                        />
                        <p className="dialog_message">{`‘Ping’ feature for ‘${name}’ is disabled`}</p>
                        <div className="btn_wrapper btn_wrapper_wide">
                            <ActionButton
                                text="Ok"
                                class="save"
                                type="button"
                                full
                                action={this.dialogClose}
                            />
                        </div>
                    </div>
                </DialogComponent>
            </div>
        );
    }
}

Pingator.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

Pingator = reduxForm({
    form: 'Pingator',
    enableReinitialize: true
})(Pingator);

function mapStateToProps(state, props) {
    return{
        initialValues: {
            ping_time:  props.ping_time || '',
        }
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        patchEditChannel,
        updateAutoSwitch
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Pingator);