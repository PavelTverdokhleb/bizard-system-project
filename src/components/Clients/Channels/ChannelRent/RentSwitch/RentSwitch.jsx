import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import SwitchedComponent from '../../../../SwitchComponent/SwitchComponent';
import DialogComponent from '../../../../HelpersBlocks/DialogComponent/DialogComponent';
import ActionButton from '../../../../Buttons/ActionButton/ActionButton';

import {patchSwitchRent} from "../../../../../actions/channelsActions";
import {updateChannelDetail} from "../../../../../actions/updateRedux";

import AttentionIcon from '../../../../../../assets/img/attention-icon.png';
import ExitDialog from '../../../../../../assets/img/exit.png';

class RentSwitch extends Component {
    constructor(props){
        super(props);
        this.state = {
            openRentOn: false,
            openRentOff: false,
            stepRentOn: props.auto_switch ? 1 : 2,
            stepRentOff: 1,
            loading: false,
            rentStatus: props.rent.rent,
            errorMessage: ''
        };
    }

    changeRent = () => {
        const {auto_switch, rent} = this.props;
        const {rentStatus} = this.state;
        if(rentStatus) this.setState({ openRentOff: true, stepRentOff: 1 });
        else this.setState({ openRentOn: true, stepRentOn: auto_switch && rent.contract_mode === 'M' ? 1 : 2});
    };

    offRent = () => {
        this.changeRentConfirm(false);
    };

    offRentConfirm = () => {
        this.setState({
            openRentOff: false
        });
    };

    onRent = () => {
        this.setState({
            stepRentOn: 2
        });
    };

    onRentConfirm = () => {
        this.changeRentConfirm(true);
    };

    changeRentConfirm = (status) => {
        const {patchSwitchRent, updateChannelDetail, ids} = this.props;
        let obj = {
            rent: status
        };
        this.setState({loading: true});
        patchSwitchRent(ids, obj).then(res=>{
            if(res.payload && res.payload.status && res.payload.status === 200) {
                let obj2 = {
                    pool: res.payload.data.pool
                };
                updateChannelDetail(obj2);
                if(status) {
                    this.setState({
                        rentStatus: status,
                        loading: false,
                        openRentOn: false
                    });
                }
                else {
                    this.setState({
                        rentStatus: status,
                        loading: false,
                        stepRentOff: 2
                    });
                }
            }
            else if (res.error && res.error.response && res.error.response.status === 400){
                this.setState({
                    stepRentOn: 3,
                    errorMessage: res.error.response.data.detail
                });
            }
            else {
                this.setState({
                    loading: false
                });
            }
        });
    };

    dialogClose = () => {
        this.setState({
            openRentOn: false,
            openRentOff: false,
        });
    };


    render(){
        const {channel_name, rent} = this.props;
        const {
            rentStatus,
            openRentOn,
            openRentOff,
            stepRentOn,
            stepRentOff,
            errorMessage
        } = this.state;
        return (
            <div className="block_white flex-center">
                <p className="rent_option_text">Bizard Rent</p>
                <SwitchedComponent
                    switched={rentStatus}
                    onSwitch={this.changeRent}
                />

                <DialogComponent
                    open={openRentOn}
                    dialogClose={this.dialogClose}
                >
                    {stepRentOn === 1 ?
                        <div className="dialog_switch_wrapper">
                            <img src={AttentionIcon}/>
                            <p className="dialog_message">Enabling the ‘Rent’ mode for this channel will disable the ‘Auto Switch’ feature. Do you want to continue?</p>
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
                                    action={this.onRent}
                                />
                            </div>
                        </div>
                        : stepRentOn === 2 ?
                            <div className="dialog_switch_wrapper">
                                <img src={AttentionIcon}/>
                                <p className="dialog_message">The system will use the following BTC wallet <span className="medium_text">{rent[`rent_${rent.rent_wallet_to_use}_address`]}</span> for rent earnings. Do you want to continue?</p>
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
                                        action={this.onRentConfirm}
                                    />
                                </div>
                            </div>
                            :
                            <div className="dialog_switch_wrapper">
                                <div className="exit-dialog" onClick={this.dialogClose}>
                                    <img src={ExitDialog} alt="exit"/>
                                </div>
                                <img src={AttentionIcon}/>
                                <p className="dialog_message">{errorMessage}</p>
                                <div className="btn_wrapper_wide">
                                    <ActionButton
                                        text="Go to settings"
                                        class="save"
                                        type="link"
                                        full
                                        href={`/admin/settings`}
                                    />
                                </div>
                            </div>
                    }
                </DialogComponent>
                <DialogComponent
                    open={openRentOff}
                    dialogClose={this.dialogClose}
                >
                    <div className="dialog_switch_wrapper">
                        <SwitchedComponent
                            switched={false}
                            bigSize
                        />
                        <p className="dialog_message">{stepRentOff === 1 ? `Do you really want to disable ‘Rent’ mode for ‘${channel_name}’?` : `‘Rent’ mode for ‘${channel_name}’ is disabled`}</p>
                        {stepRentOff === 1 ?
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
                                    action={this.offRent}
                                />
                            </div>
                            :
                            <div className="btn_wrapper btn_wrapper_wide">
                                <ActionButton
                                    text="Ok"
                                    class="save"
                                    type="button"
                                    full={true}
                                    action={this.offRentConfirm}
                                />
                            </div>
                        }
                    </div>
                </DialogComponent>
            </div>
        );
    }
}

RentSwitch.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        patchSwitchRent,
        updateChannelDetail
    }, dispatch);
}

export default connect(null, mapDispatchToProps)(RentSwitch);