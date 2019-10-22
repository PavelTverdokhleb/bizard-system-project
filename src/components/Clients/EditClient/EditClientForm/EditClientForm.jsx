import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Field, reduxForm, SubmissionError, formValueSelector} from 'redux-form';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {email, required, percents, symbolsAfterDot} from "../../../../helpers/validation";
import RenderField from "../../../HelpersBlocks/RenderField/RenderField";
import RenderRadio from "../../../HelpersBlocks/RenderRadio/RenderRadio";
import ActionButton from '../../../Buttons/ActionButton/ActionButton';
import Loader from '../../../Loader/Loader';
import {getError} from "../../../../helpers/functions";
import DeleteComponent from '../../DeleteComponent/DeleteComponent';
import BreadCrumbs from '../../../BreadCrumbs/BreadCrumbs';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import NoMatch from '../../../../containers/NoMatch/NoMatch';
import DialogComponent from '../../../HelpersBlocks/DialogComponent/DialogComponent';

import {
    postAddClient,
    getClientDetail,
    patchEditClient,
    deleteClient
} from "../../../../actions/clientsActions";

import ErrorIcon from '../../../../../assets/img/error_icon.png';
import SuccessIcon from '../../../../../assets/img/success_icon.png';
import AttentionIcon from '../../../../../assets/img/attention-icon.png';
import ExitDialog from '../../../../../assets/img/exit.png';

import './EditClientForm.scss';


let timeout;

class EditClientForm extends Component {
    constructor(props){
        super(props);
        const {id} = this.props;
        this.id = id !== 'add';
        this.state = {
            open: false,
            loading: false,
            loadingPage: false,
            success: false,
            loadingPlatforms: false,
            notFound: false,
            dialogMessage: ''
        };
    }

    componentDidMount(){
        const {getClientDetail, id, client} = this.props;
        if(this.id && client === undefined){
            this.setState({loadingPage: true});
            getClientDetail(id).then((res)=>{
                if(res.payload && res.payload.status && res.payload.status === 200){
                    this.setState({loadingPage: false});
                }
                else if(res.error && res.error.response && res.error.response.status === 404){
                    this.setState({notFound: true});
                }
                else {
                    this.setState({loadingPage: false});
                }
            });
        }
    }

    componentWillUnmount(){
        clearTimeout(timeout);
        this.props.clients.client_inner_error = {};
    }

    SubmitForm=(data)=>{
        const {postAddClient, patchEditClient, id, history} = this.props;
        this.setState({loading: true});
        if(this.id){
            let objEdit = {
                name: data.name,
                mode: data.clientType
            };
            data.clientType === 'FM' ? objEdit['fee'] = data.fee : null;
            return patchEditClient(id, objEdit).then((res)=>{
                if(res.payload && res.payload.status && res.payload.status === 200){
                    this.setState({loading: false, success: true});
                    timeout = setTimeout(()=>{
                        this.setState({success: false});
                    }, 3000);
                }
                else if (res.error && res.error.response && res.error.response.status === 400 && res.error.response.data && res.error.response.data.mode) {
                    this.setState({loading: false, open: true, dialogMessage: res.error.response.data.mode});
                    throw new SubmissionError({...res.error.response.data, _error: 'Change mode failed.'});
                }
                else {
                    this.setState({loading: false});
                    throw new SubmissionError({...res.error.response.data, _error: res.error.response.data.detail ? res.error.response.data.detail : 'Edit client failed'});
                }
            });
        }
        else {
            let objAdd = {
                name: data.name,
                email: data.email,
                mode: data.clientType
            };
            data.clientType === 'FM' ? objAdd['fee'] = data.fee : null;
            return postAddClient(objAdd).then((res)=>{
                if(res.payload && res.payload.status && res.payload.status === 201){
                    this.setState({loading: false});
                    history.push('/admin/clients');
                }
                else {
                    this.setState({loading: false});
                    throw new SubmissionError({...res.error.response.data, _error: 'Add client failed'});
                }
            });
        }
    };

    closeDialog = () => {
        this.setState({open: false});
    };

    render(){
        const { handleSubmit, submitting, pristine, error, history, clients:{client_detail, client_inner_error}, deleteClient, clientMode }  = this.props;
        const { loading, loadingPage, notFound, success, open, dialogMessage } = this.state;
        let breadItems = [
            {url: '/admin/clients', name: 'Clients' },
            {url: null, name: this.id ? `${client_detail.name}` : 'Add Client'}
        ];
        if(notFound) return <NoMatch/>;
        else if(loadingPage) return <Loader class="page_client_inner"/>;
        return (
            <div>
                <div>
                    <BreadCrumbs items={breadItems}/>
                </div>
                <div className="page_header display_edit_client">
                    <h2>{this.id ? `${client_detail.name}` : 'Add Client'}</h2>
                </div>
                <div className="page_content_wrapper">
                    <form onSubmit={handleSubmit(this.SubmitForm)}>
                        <div className="block_container block_inner block_distance">
                            <div className="fields_wrapper">
                                <Field
                                    name="name"
                                    type="text"
                                    classes="edit_input"
                                    component={RenderField}
                                    label="Name"
                                    validate={[required]}
                                />
                                <Field
                                    name="email"
                                    type="text"
                                    classes={this.id ? "edit_input disable_field" : "edit_input"}
                                    component={RenderField} label="Email"
                                    disabled={this.id}
                                    validate={[required, email]}
                                />
                            </div>
                            <div className="editing_client">
                                {this.id ?
                                    <p className="client_type_description">
                                        NB! Before switching the client to another mode, please, make sure, that you have set the appropriate correct wallets on the external mining pools you're going to use!
                                    </p>
                                    :
                                    null
                                }
                                <Field
                                    name="clientType"
                                    component={RenderRadio}
                                >
                                    <FormControlLabel
                                        value="M"
                                        control={<Radio />}
                                        label={<div className="radio_descriptions"><h5>Monitoring only</h5><p>Manage the hashrate distributing it to flexible channels, monitor the effectiveness of your hardware of every customer & get all the stats you need from the mining pools</p></div>}
                                    />
                                    <FormControlLabel
                                        value="FM"
                                        control={<Radio />}
                                        label={<div className="radio_descriptions"><h5>Finances & Monitoring</h5><p>Set the financial routine to automatic mode & distribute the customers' rewards according to your preferences</p></div>}
                                    />
                                </Field>
                                <div className="fee-block">
                                    <Field
                                        name="fee"
                                        type="number"
                                        classes={clientMode === 'M' ? "edit_input small_field  field_symbol_wrapper full_disable_field" : "edit_input small_field  field_symbol_wrapper"}
                                        symbol="%"
                                        component={RenderField}
                                        disabled={clientMode === 'M'}
                                        label="Default Fee"
                                        validate={clientMode === 'FM' ? [required, percents, symbolsAfterDot] : null}
                                    />
                                </div>
                                {this.id ?
                                    <div className="client_default_wallets_block" style={{opacity: clientMode === 'FM' ? 1 : 0.6}}>
                                        <p className="client_edit_subtitle">Default Internal Wallets</p>
                                        <div className="client_wallets_wrapper">
                                            <Field
                                                name="btc_wallet"
                                                type="text"
                                                classes="edit_input disable_input"
                                                disabled
                                                component={RenderField}
                                                label="BTC Wallet"
                                            />
                                            <Field
                                                name="ltc_wallet"
                                                type="text"
                                                classes="edit_input disable_input"
                                                disabled
                                                component={RenderField}
                                                label="LTC Wallet"
                                            />
                                            <Field
                                                name="eth_wallet"
                                                type="text"
                                                classes="edit_input disable_input"
                                                disabled
                                                component={RenderField}
                                                label="ETH Wallet"
                                            />
                                        </div>
                                    </div>
                                    :
                                    <p className="info-client" >*Our system will automatically generate default internal wallets for BTC, LTC and ETH coins as you click the «Save» button.</p>
                                }
                            </div>
                        </div>
                        <div className="block_container block_inner btn_wrapper">
                            {!this.id ?
                                <ActionButton
                                    text="cancel"
                                    class="cancel"
                                    type="link"
                                    href="/admin/clients"
                                />
                                :
                                null
                            }
                            {this.id ?
                                <DeleteComponent
                                    id={client_detail.id}
                                    text={`Do you really want to terminate the contract with «${client_detail.name}»?`}
                                    onDelete={deleteClient}
                                    redirect={'/admin/clients'}
                                    history={history}
                                    disabled={success}
                                    type='Terminate'
                                />
                                :
                                null
                            }
                            {!loading ?
                                <ActionButton
                                    text="save"
                                    class="save"
                                    type="button"
                                    disabled={submitting || Boolean(error) || pristine || success}
                                    formAction
                                />
                                :
                                <Loader class="btn"/>
                            }
                            {error !== undefined ? <p className="page_error"><img src={ErrorIcon} alt="icon"/>{error}</p> : null}
                            {success ? <p className="page_success"><img src={SuccessIcon} alt="icon"/>Successfully saved</p> : null}
                            {client_inner_error.detail ? <div className="page_error"><img src={ErrorIcon} alt="icon"/>{getError(client_inner_error)}</div> : null}
                        </div>
                    </form>
                </div>
                <DialogComponent
                    open={open}
                    dialogClose={this.closeDialog}
                >
                    <div className="dialog_delete_wrapper change_mode_dialog">
                        <img src={AttentionIcon}/>
                        <p className="dialog_message">
                            Before switching this client from Monitoring Only mode to Finance & Monitoring mode you have to:
                        </p>
                        {dialogMessage !== '' ?
                            <ul className="change_mode_list">
                                {dialogMessage.map((el, i)=>(
                                    <li key={i}>{el}</li>
                                ))}
                            </ul>
                            : null
                        }
                        <div className="flex-center btn_wrapper_wide">
                            <ActionButton
                                text="OK"
                                class="save"
                                type="button"
                                action={this.closeDialog}
                                full
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

EditClientForm.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

EditClientForm = reduxForm({
    form: 'EditClientForm',
    enableReinitialize: true
})(EditClientForm);

const selector = formValueSelector('EditClientForm');

function mapStateToProps(state, props) {
    const {client_detail:{wallets}, client_detail} = state.clients;
    let walletsObj = {};
    if(props.id !== 'add' && wallets && wallets.length) {
        wallets.map(el=>{
            walletsObj[el.symbol] = el.address;
        });
    }
    const clientMode = selector(state, 'clientType');
    return{
        clients: state.clients,
        clientMode: clientMode,
        initialValues: {
            name: props.id !== 'add' && client_detail.name || '',
            email: props.id !== 'add' && client_detail.email || '',
            fee: props.id !== 'add' && client_detail.fee !== null && client_detail.fee || '',
            clientType: props.id !== 'add' && client_detail.mode || 'M',
            btc_wallet: props.id !== 'add' && walletsObj && walletsObj.BTC || '',
            ltc_wallet: props.id !== 'add' && walletsObj && walletsObj.LTC || '',
            eth_wallet: props.id !== 'add' && walletsObj && walletsObj.ETH || ''
        }
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        postAddClient,
        getClientDetail,
        patchEditClient,
        deleteClient
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditClientForm);
