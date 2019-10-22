import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Field, reduxForm, SubmissionError} from "redux-form";
import RenderField from "../HelpersBlocks/RenderField/RenderField";
import ActionButton from "../Buttons/ActionButton/ActionButton";
import Loader from '../Loader/Loader';
import {patchUser} from "../../actions/userActions";
import {updateUser} from "../../actions/updateRedux";
import ErrorIcon from '../../../assets/img/error_icon.png';
import SuccessIcon from '../../../assets/img/success_icon.png';
import "./Settings.scss";

let timeout;

class Settings extends Component {
    state = {
        loading: false,
        success: false
    };

    componentWillUnmount() {
        clearTimeout(timeout);
    }

    SubmitForm=(data)=>{
        const {patchUser, updateUser} = this.props;
        let arr = [];
        for (let key in data) {
            arr.push({
                currency: key.toUpperCase(),
                address: data[key]
            });
        }
        let obj = {
            wallets: arr
        };
        this.setState({loading: true});
        return patchUser(obj).then(res=>{
            if(res.payload && res.payload.status && res.payload.status === 200){
                this.setState({loading: false, success: true});
                updateUser(res.payload.data);
                timeout = setTimeout(()=>{
                    this.setState({success: false});
                }, 3000);
            }
            else {
                const {data} = res.error.response;
                this.setState({loading: false});
                let arr = {};
                if(data.wallets && data.wallets.length) {
                    data.wallets.forEach(el=>{
                       arr[el.currency.toLowerCase()] = el.address;
                    });
                }
                throw new SubmissionError({...arr, _error: data.detail ? data.detail : 'Settings save failed'});
            }
        });
    };

    render(){
        const { handleSubmit, submitting, pristine, error} = this.props;
        const { loading, success } = this.state;
        return (
            <div className="settings_page">
                <div className="page_header">
                    <h2>Settings</h2>
                </div>
                <div className="settings-wallets">
                    <div className="title-settings">System Wallets for payments (not required for ‘Monitoring Only’ mode)</div>
                    <form onSubmit={handleSubmit(this.SubmitForm)}>
                        <div className="field-block">
                            <Field name="btc" type="text" classes="settings_input" component={RenderField} label="BTC Wallet"/>
                            <Field name="ltc" type="text" classes="settings_input" component={RenderField} label="LTC Wallet"/>
                            <Field name="eth" type="text" classes="settings_input" component={RenderField} label="ETH Wallet"/>
                        </div>
                        <div className="settings-button">
                            {!loading ?
                                <ActionButton
                                    text="save"
                                    class="save"
                                    type="button"
                                    disabled={submitting || pristine}
                                    formAction
                                />
                                :
                                <Loader class="btn"/>
                            }
                            {error !== undefined ? <p className="page_error"><img src={ErrorIcon} alt="icon"/>{error}</p> : null}
                            {success ? <p className="page_success"><img src={SuccessIcon} alt="icon"/>Successfully saved</p> : null}
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

Settings.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

Settings = reduxForm({
    form: 'SettingsForm',
    enableReinitialize: true
})(Settings);


function mapStateToProps(state, props) {
    const {user_info:{wallets}} = state.user;
    let walletsObj = {};
    if(wallets && wallets.length) {
        wallets.map(el=>{
           walletsObj[el.currency] = el.address;
        });
    }
    return{
        initialValues: {
            btc: props.id !== 'add' && walletsObj && walletsObj.BTC || '',
            ltc: props.id !== 'add' && walletsObj && walletsObj.LTC || '',
            eth: props.id !== 'add' && walletsObj && walletsObj.ETH || ''
        }
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        patchUser,
        updateUser
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

