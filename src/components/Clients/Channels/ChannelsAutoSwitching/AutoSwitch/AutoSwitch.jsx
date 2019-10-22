import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import SwitchedComponent from '../../../../SwitchComponent/SwitchComponent';
import DialogComponent from '../../../../HelpersBlocks/DialogComponent/DialogComponent';
import ActionButton from '../../../../Buttons/ActionButton/ActionButton';
import RenderField from '../../../../HelpersBlocks/RenderField/RenderField';
import {required, integerNumber, maxValue} from "../../../../../helpers/validation";
import {balanceTopUp} from "../../../../../helpers/normalize";

import {patchEditChannel} from "../../../../../actions/channelsActions";
import {updateAutoSwitch} from "../../../../../actions/updateRedux";

import AttentionIcon from '../../../../../../assets/img/attention-icon.png';

import './AutoSwitch.scss';

class AutoSwitch extends Component {
    constructor(props){
        super(props);
        this.state = {
            autoSwitch: props.auto_switch,
            openAutoOn: false,
            openAutoOff: false,
            stepAutoOn: props.rent ? 1 : 2
        };
    }

    changeAutoSwitch = () => {
        const {rent} = this.props;
        const {autoSwitch} = this.state;
        if(autoSwitch) {
            let objSend = {
                auto_switch: false,
            };
            let objUpdate = {
                field_switch: 'auto_switch',
                field_switch_value: false
            };
            this.switchConfirm(false, objSend, objUpdate);
        }
        else {
            this.setState({ openAutoOn: true, stepAutoOn: rent ? 1 : 2 });
        }
    };

    onAutoSwitch = () => {
        this.setState({stepAutoOn: 2});
    };

    switchConfirm = (status, objSend, objUpdate) => {
        const {patchEditChannel, updateAutoSwitch,ids} = this.props;
        this.setState({loading: true});
        patchEditChannel(ids[0], ids[1], objSend).then(res=>{
            if(res.payload && res.payload.status && res.payload.status === 200) {
                updateAutoSwitch(objUpdate);
                if(status) {
                    this.setState({
                        autoSwitch: status,
                        loading: false,
                        openAutoOn: false
                    });
                }
                else {
                    this.setState({
                        autoSwitch: status,
                        loading: false,
                        openAutoOff: true
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
            auto_switch_time: Number(data.auto_switch_time),
            auto_switch: true,
        };
        let objUpdate = {
            field_switch: 'auto_switch',
            field_switch_value: true,
            field_switch_min: 'auto_switch_time',
            field_switch_min_value: Number(data.auto_switch_time),
            field_change: 'rent',
            field_change_value: false
        };
        this.switchConfirm(true, objSend, objUpdate);
    };

    dialogClose = () => {
        this.setState({
            openAutoOn: false,
            openAutoOff: false,
        });
    };

    render(){
        const {handleSubmit, auto_switch_time, ping, name} = this.props;
        const {autoSwitch, openAutoOn, openAutoOff, stepAutoOn} = this.state;
        return (
            <div className="auto_block_white">
                <div className="auto_switch_text_wrapper">
                    <p className="switch_option_text">Auto Switch</p>
                    {autoSwitch ?
                        <p className="switch_option_small_text auto_small_text">Autoswitching if the coin on top for more than {auto_switch_time} minutes</p>
                        :
                        null
                    }
                </div>
                <SwitchedComponent
                    switched={autoSwitch}
                    onSwitch={this.changeAutoSwitch}
                    disabled={ping}
                />

                <DialogComponent
                    open={openAutoOn}
                    dialogClose={this.dialogClose}
                >
                    {stepAutoOn === 1 ?
                        <div className="dialog_switch_wrapper dialog_auto_wrapper">
                            <img src={AttentionIcon}/>
                            <p className="dialog_message">Enabling the ‘Auto Switch’ mode for this channel will disable the ‘Rent’ feature. Do you want to continue?</p>
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
                                    action={this.onAutoSwitch}
                                />
                            </div>
                        </div>
                        :
                        <div className="dialog_switch_wrapper dialog_auto_wrapper">
                            <SwitchedComponent
                                switched={true}
                                bigSize
                            />
                            <p className="dialog_message">Should we switch mining to the most profitable coin mechanism as this coin stays on top of the rating for X minutes?</p>
                            <form onSubmit={handleSubmit(this.SubmitForm)}>
                                <Field
                                    name="auto_switch_time"
                                    type="text"
                                    classes="edit_input field_symbol_wrapper full_width_text_field"
                                    component={RenderField}
                                    symbol="MIN"
                                    label="Enter the X value"
                                    validate={[required, integerNumber, maxValue(4320)]}
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
                    }
                </DialogComponent>
                <DialogComponent
                    open={openAutoOff}
                    dialogClose={this.dialogClose}
                >
                    <div className="dialog_switch_wrapper">
                        <SwitchedComponent
                            switched={false}
                            bigSize
                        />
                        <p className="dialog_message">{`‘Auto Switch’ mode for ‘${name}’ is disabled`}</p>
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

AutoSwitch.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

AutoSwitch = reduxForm({
    form: 'AutoSwitch',
    enableReinitialize: true
})(AutoSwitch);

function mapStateToProps(state, props) {
    return{
        initialValues: {
            auto_switch_time:  props.auto_switch_time || '',
        }
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        patchEditChannel,
        updateAutoSwitch
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AutoSwitch);