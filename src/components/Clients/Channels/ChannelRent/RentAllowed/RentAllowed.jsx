import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {toFixedHash, symbolHash} from "../../../../../helpers/hashrateConvert";
import RentSwitch from '../RentSwitch/RentSwitch';
import Pagination from '../../../../Pagination/Pagination';
import TableLoader from '../../../../TableLoader/TableLoader';
import RenderRadio from '../../../../HelpersBlocks/RenderRadio/RenderRadio';
import RenderField from "../../../../HelpersBlocks/RenderField/RenderField";
import {Field, reduxForm, SubmissionError, change, untouch, formValueSelector} from 'redux-form';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DialogComponent from '../../../../HelpersBlocks/DialogComponent/DialogComponent';
import ActionButton from '../../../../Buttons/ActionButton/ActionButton';
import Loader from '../../../../Loader/Loader';
import {percents, required, symbolsAfterDot} from "../../../../../helpers/validation";
import moment from "moment/moment";
import RentWallet from '../RentWallet/RentWallet';

import {getRentTransactions, patchEditChannel, postChangeExternalWallet} from "../../../../../actions/channelsActions";
import {updateRent} from "../../../../../actions/updateRedux";

import ErrorIcon from '../../../../../../assets/img/error_icon.png';
import SuccessIcon from '../../../../../../assets/img/success_icon.png';
import ExitDialog from '../../../../../../assets/img/exit.png';
import AttentionIcon from '../../../../../../assets/img/attention-icon.png';

import './RentAllowed.scss';

let timeout;

class RentAllowed extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            empty: false,
            activePage: 1,
            open: false,
            success: false,
            confirmWallet: false
        };
    }

    componentDidMount(){
        const {activePage} = this.state;
        this.doRequest(activePage);
    }

    componentWillUnmount(){
        clearTimeout(timeout);
    }

    doRequest = (page) => {
        const {getRentTransactions, clients:{client_detail}, channels:{channel_detail}} = this.props;
        let arr = [client_detail.id, channel_detail.id];
        this.setState({loading: true});
        getRentTransactions(arr, page).then((res)=>{
            if(res.payload && res.payload.status && res.payload.status === 200){
                this.setState({loading: false});
                if(res.payload.data.results.length === 0){
                    this.setState({empty: true});
                }
            }
            else {
                this.setState({loading: false});
            }
        });
    };

    SubmitForm = (data) => {
        const {patchEditChannel, updateRent, postChangeExternalWallet, rent, clients:{client_detail}, channels:{channel_detail}} = this.props;
        let obj = {
            rent_wallet_to_use: data.default === 'default_true' ? 'default' : 'specific',
        };
        if(data.specific === 'specific_true'){
            if(rent.contract_mode === 'FM'){
                obj['rent_specific_fee'] = data.rent_specific_fee;
            }
            if(rent.contract_mode === 'M') {
                if(data.specific_address === ''){
                    throw new SubmissionError({ specific_address: 'Required'});
                }
                let arr = [client_detail.id, channel_detail.id];
                let sendData = {
                    wallet: data.specific_address
                };
                return postChangeExternalWallet(arr, sendData).then(res=>{
                    if(res.payload && res.payload.status && res.payload.status === 200){
                        this.specificAddressSet(arr, obj);
                    }
                    else {
                        throw new SubmissionError({ specific_address: res.error.response.data.detail });
                    }
                });
            }
            else {
                this.setState({loadWalletEdit: true});
                return patchEditChannel(client_detail.id, channel_detail.id, obj).then((res)=>{
                    if(res.payload && res.payload.status && res.payload.status === 200){
                        this.setState({loadWalletEdit: false, success: true});
                        timeout = setTimeout(()=>{
                            this.setState({success: false});
                        }, 3000);
                        let objUpdate = {
                            field_wallet_to_use: 'rent_wallet_to_use',
                            field_wallet_to_use_value: data.default === 'default_true' ? 'default' : 'specific',
                            field_specific_fee: 'rent_specific_fee',
                            field_specific_fee_value: Number(data.rent_specific_fee).toFixed(3),
                            field_specific_address: 'rent_specific_address',
                            field_specific_address_value: data.specific_address
                        };
                        updateRent(objUpdate);
                    }
                    else {
                        this.setState({loadWalletEdit: false});
                        throw new SubmissionError({...res.error.response.data, _error: res.error.response.data.detail ? res.error.response.data.detail : 'Edit wallets failed'});
                    }
                });
            }
        }
        else {
            this.setState({loadWalletEdit: true});
            return patchEditChannel(client_detail.id, channel_detail.id, obj).then((res)=>{
                if(res.payload && res.payload.status && res.payload.status === 200){
                    this.setState({loadWalletEdit: false, success: true});
                    timeout = setTimeout(()=>{
                        this.setState({success: false});
                    }, 3000);
                    let objUpdate = {
                        field_wallet_to_use: 'rent_wallet_to_use',
                        field_wallet_to_use_value: data.default === 'default_true' ? 'default' : 'specific',
                        field_specific_fee: 'rent_specific_fee',
                        field_specific_fee_value: Number(data.rent_specific_fee).toFixed(3),
                        field_specific_address: 'rent_specific_address',
                        field_specific_address_value: data.specific_address
                    };
                    updateRent(objUpdate);
                }
                else {
                    this.setState({loadWalletEdit: false});
                    throw new SubmissionError({...res.error.response.data, _error: res.error.response.data.detail ? res.error.response.data.detail : 'Edit wallets failed'});
                }
            });
        }
    };

    specificAddressSet = (arr, obj) => {
        const {patchEditChannel} = this.props;
        console.log(obj);

        return patchEditChannel(arr[0], arr[1], obj).then((res)=>{
            if(res.payload && res.payload.status && res.payload.status === 200){
                this.setState({confirmWallet: true});
            }
            else {
                this.setState({loadWalletEdit: false});
                throw new SubmissionError({...res.error.response.data, _error: res.error.response.data.detail ? res.error.response.data.detail : 'Edit wallets failed'});
            }
        });
    };

    changePage = pageNumber => {
        this.setState({activePage: pageNumber});
        this.doRequest(pageNumber);
    };

    changeRadio = event => {
        const {dispatch} = this.props;
        if(event.target.value === 'default_true'){
            dispatch(change('RentAllowed', 'specific', 'specific_false'));
            dispatch(untouch('RentAllowed', 'specific'));
            dispatch(untouch('RentAllowed', 'rent_specific_fee'));
        }
        else {
            dispatch(change('RentAllowed', 'default', 'default_false'));
            dispatch(untouch('RentAllowed', 'default'));
        }
    };

    openDialog = () => {
        this.setState({open: true});
    };

    closeDialog = () => {
        this.setState({open: false});
    };

    closeWalletDialog = () => {
        this.setState({confirmWallet: false});
    };

    render(){
        const {rent:{hashrate, unpaid_balance, btc_revenue, usd_revenue, auto_switch, contract_mode}, activeType, specificAddress, channels:{rent_transactions, channel_detail}, clients:{client_detail}, error, submitting, pristine, handleSubmit} = this.props;
        const {loading, empty, activePage, open, success, loadWalletEdit, confirmWallet} = this.state;
        let ids = [client_detail.id, channel_detail.id];
        return (
            <div>
                {loading ? <TableLoader/> : null}
                <div className="rent_top_block">
                    <RentSwitch
                        ids={ids}
                        auto_switch={auto_switch}
                        rent={this.props.rent}
                        channel_name={channel_detail.name}
                    />
                    <div className="block_white rent_block_column">
                        <div>
                            <p className="rent_option_text">Estimate earnings</p>
                            <span className="rent_option_small_text">for your channel hashrate <span
                                className="rent_medium_text">{`${toFixedHash(hashrate)} ${symbolHash(hashrate)}`}</span></span>
                        </div>
                        <div>
                            <p className="rent_option_value">{Number(btc_revenue).toFixed(6)} BTC/day</p>
                            <span className="rent_option_small_value">{Number(usd_revenue).toFixed(2)} $/day</span>
                        </div>
                    </div>
                    <div className="block_white rent_block_column rent_unpaid_balance">
                        <div>
                            <p className="rent_option_text">Unpaid Balance</p>
                        </div>
                        <div>
                            <p className="rent_option_value">{Number(unpaid_balance).toFixed(6)} BTC</p>
                        </div>
                    </div>
                </div>


                <div className="block_container">
                    <form onSubmit={handleSubmit(this.SubmitForm)}>
                        <div className="rent_editing block_inner">
                            <div className="wallets-info">
                                {contract_mode === 'FM' ?
                                    '‘Rent’ mode transit internal BTC wallet:'
                                    :
                                    '‘Rent’ mode destination BTC wallet:'
                                }
                            </div>
                            <Field
                                name="default"
                                onChange={this.changeRadio}
                                component={RenderRadio}
                            >
                                <FormControlLabel
                                    value="default_true"
                                    onChange={this.changeRadio}
                                    control={<Radio />}
                                    label={contract_mode === 'FM'
                                        ? <div className="radio_descriptions"><h5>Use the default transit internal client’s BTC wallet for this channel</h5></div>
                                        : <div className="radio_descriptions"><h5>Use the default datacenter’s external BTC wallet for this channel</h5></div>
                                    }
                                />
                            </Field>
                            <div className="channel_field_wrapper rent_field_space">
                                <Field
                                    name="default_address"
                                    type="text"
                                    classes={activeType !== 'default_true' ? "edit_input full_disable_field" : "edit_input disable_input"}
                                    component={RenderField}
                                    disabled
                                    label={`BTC Wallet`}
                                />
                            </div>
                            <Field
                                name="specific"
                                onChange={this.changeRadio}
                                component={RenderRadio}
                            >
                                <FormControlLabel
                                    value="specific_true"
                                    control={<Radio />}
                                    label={contract_mode === 'FM'
                                        ? <div className="radio_descriptions"><h5>Use the generated specific transit client’s BTC wallet for this channel</h5></div>
                                        : <div className="radio_descriptions"><h5>Use a specific datacenter’s external BTC wallet for this channel</h5></div>
                                    }
                                />
                            </Field>
                            <div className="channel_field_wrapper channel_wallet_field">
                                <Field
                                    name="specific_address"
                                    type="text"
                                    classes={activeType === 'default_true' ? "edit_input full_disable_field" : contract_mode === 'M' ? "edit_input" : "edit_input disable_input"}
                                    component={RenderField}
                                    disabled={activeType === 'default_true' || contract_mode === 'FM'}
                                    label={`BTC Wallet spec`}
                                />
                            </div>
                            {contract_mode === 'FM' ?
                                <Field
                                    name="rent_specific_fee"
                                    type="number"
                                    classes={activeType === 'default_true' ? "edit_input small_field field_symbol_wrapper full_disable_field" : "edit_input small_field field_symbol_wrapper"}
                                    symbol="%"
                                    component={RenderField}
                                    disabled={activeType === 'default_true'}
                                    validate={activeType === 'default_false' ? [required, percents, symbolsAfterDot] : []}
                                    label="Specific Fee"
                                />
                                :
                                null
                            }

                        </div>
                        <div className="block_inner btn_wrapper">
                            {!loadWalletEdit ?
                                <ActionButton
                                    text="save"
                                    class="save"
                                    type="button"
                                    disabled={submitting || pristine || success}
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


                <div className="table_container rent_transactions_columns">
                    <div className="table_header">
                        <div className="block_table_title">
                            <h2>Transactions History</h2>
                            <div className="table_row">
                                <p>Date/Time</p>
                                <p>Earning</p>
                                <p>Address</p>
                                <p>Status</p>
                            </div>
                        </div>
                    </div>
                    <div className="table_body">
                        {!empty && rent_transactions.results && rent_transactions.results.length ?
                            rent_transactions.results.map((el, i)=> (
                                <div className="table_row" key={i}>
                                    <p className="gray_text">{moment(el.date).format('DD/MM/YYYY HH:mm')}</p>
                                    <p className="gray_text">{`${Number(el.amount).toFixed(2)} ${el.currency}`}</p>
                                    <p className="gray_text">
                                        {el.wallet !== null ?
                                            el.blockchain_url !== null ?
                                                <a href={el.blockchain_url} className="rent_trans_link">{el.wallet}<img src="/assets/img/link.png"/></a>
                                                :
                                                el.wallet
                                            :
                                            '-'
                                        }
                                    </p>
                                    {el.status === 'Completed' ? <p className="rent_trans_status"><img src="/assets/img/success_icon.png"/>{el.status}</p> : <p className="gray_text">{el.status}</p>}
                                </div>
                            ))
                            :
                            empty ?
                                <div className="table_row">
                                    <p className="table_no_items">No items</p>
                                </div>
                                :
                                null
                        }
                    </div>
                    {rent_transactions.count && rent_transactions.count > 10 ?
                        <Pagination
                            current={activePage}
                            pageCount={10}
                            total={rent_transactions.count}
                            onChange={this.changePage}
                        />
                        :
                        null
                    }
                </div>
                <RentWallet
                    open={confirmWallet}
                    closeDialog={this.closeWalletDialog}
                    address={specificAddress}
                />
                <DialogComponent
                    open={open}
                    dialogClose={this.closeDialog}
                >
                    <div className="dialog_delete_wrapper">
                        <img src={AttentionIcon}/>
                        <span className="dialog_message">You can’t create the channel for this coin. Please, <br/> ensure that you & your client both have Ethereum <br/> wallet assigned to your accounts</span>
                        <div className="flex-center btn_wrapper_wide">
                            <ActionButton
                                action={this.closeDialog}
                                text="GO TO SETTINGS"
                                class="save"
                                type="button"
                                full
                                formAction
                            />
                        </div>
                        <div className="exit-dialog" onClick={this.closeDialog}>
                            <img src={ExitDialog} alt="exit"/>
                        </div>
                    </div>
                </DialogComponent>
            </div>

        );
    }
}

RentAllowed.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

RentAllowed = reduxForm({
    form: 'RentAllowed',
    enableReinitialize: true
})(RentAllowed);

const selector = formValueSelector('RentAllowed');

function mapStateToProps(state, props) {
    const activeType = selector(state, 'default');
    const specificAddress = selector(state, 'specific_address');
    return{
        activeType,
        specificAddress,
        clients: state.clients,
        channels: state.channels,
        initialValues: {
            default_address: props.rent.rent_default_address || '',
            specific_address: props.rent.rent_specific_address || '',
            rent_specific_fee: props.rent.rent_specific_fee || '',
            default: props.rent.rent_wallet_to_use === 'default' ? `${props.rent.rent_wallet_to_use}_true` : 'default_false',
            specific: props.rent.rent_wallet_to_use === 'specific' ? `${props.rent.rent_wallet_to_use}_true` : 'specific_false',
        }
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getRentTransactions,
        patchEditChannel,
        postChangeExternalWallet,
        updateRent
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RentAllowed);