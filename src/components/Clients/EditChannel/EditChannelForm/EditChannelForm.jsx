import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Field, reduxForm, SubmissionError, untouch, change, formValueSelector} from 'redux-form';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {percents, required, symbolsAfterDot} from "../../../../helpers/validation";
import MenuItem from '@material-ui/core/MenuItem';
import RenderField from "../../../HelpersBlocks/RenderField/RenderField";
import RenderRadio from "../../../HelpersBlocks/RenderRadio/RenderRadio";
import ActionButton from '../../../Buttons/ActionButton/ActionButton';
import Loader from '../../../Loader/Loader';
import {getError} from "../../../../helpers/functions";
import DeleteComponent from '../../DeleteComponent/DeleteComponent';
import BreadCrumbs from '../../../BreadCrumbs/BreadCrumbs';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DialogComponent from '../../../HelpersBlocks/DialogComponent/DialogComponent';
import RenderSelect from "../../../HelpersBlocks/RenderSelect/RenderSelect";
import NoMatch from '../../../../containers/NoMatch/NoMatch';

import {
    postAddChannel,
    getChannelDetail,
    getInternalWallets,
    getPlatforms,
    patchEditChannel,
    deleteChannel
} from "../../../../actions/channelsActions";
import {getUser} from "../../../../actions/userActions";

import ErrorIcon from '../../../../../assets/img/error_icon.png';
import SuccessIcon from '../../../../../assets/img/success_icon.png';
import ExitDialog from '../../../../../assets/img/exit.png';
import AttentionIcon from '../../../../../assets/img/attention-icon.png';

import './EditChannelForm.scss';

let timeout;

class EditChannelForm extends Component {
    constructor(props){
        super(props);
        const {channel, channels:{channel_detail}} = this.props;
        this.id = channel !== 'add-channel';
        this.state = {
            loading: false,
            loadingPage: false,
            loadingPlatforms: false,
            loadingWallets: false,
            success: false,
            open: false,
            currentCurrency: this.id ? channel_detail.wallet_currency : 'BTC',
            notFound: false,
            dialogMessage: ''
        };
    }

    componentDidMount(){
        const {getChannelDetail, getPlatforms, getInternalWallets, channel, clients:{client_detail:{id}}, channels:{platforms}} = this.props;
        if(!platforms || !platforms.length) {
            this.setState({loadingPlatforms: true});
            getPlatforms().then(()=>{
                this.setState({loadingPlatforms: false});
            });
        }
        if(!this.id) {
            this.setState({loadingWallets: true});
            getInternalWallets(id).then(()=>{
                this.setState({loadingWallets: false});
            });
        }
        if(this.id && channel !== undefined){
            this.setState({loadingPage: true});
            getChannelDetail(id, channel).then((res)=>{
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
        this.props.channels.channels_inner_error = [];
        this.props.channels.internal_wallets = {};
    }

    SubmitForm=(data)=>{
        const {postAddChannel, patchEditChannel, getUser, match, channelType, channels:{channel_detail}, clients:{client_detail:{id}}, history} = this.props;
        this.setState({loading: true});
        if(this.id){
            let obj = {
                name: data.name,
                wallet_to_use: channelType === 'default_true' ? 'default' : 'specific',
            };
            if(channelType !== 'default_true') {
                obj['specific_fee'] = data.specific_fee;
            }
            return patchEditChannel(id, channel_detail.id, obj).then((res)=>{
                if(res.payload && res.payload.status && res.payload.status === 200){
                    this.setState({loading: false, success: true});
                    timeout = setTimeout(()=>{
                        this.setState({success: false});
                    }, 3000);
                }
                else {
                    this.setState({loading: false});
                    throw new SubmissionError({...res.error.response.data, _error: res.error.response.data.detail ? res.error.response.data.detail : 'Edit channel failed.'});
                }
            });
        }
        else {
            let obj = {
                name: data.name,
                algorithm: data.algorithm,
                wallet_to_use: channelType === 'default_true' ? 'default' : 'specific',
            };
            if(channelType !== 'default_true'){
                obj['specific_fee'] = data.specific_fee;
            }
            return postAddChannel(id, obj).then((res)=>{
                if(res.payload && res.payload.status && res.payload.status === 201){
                    this.setState({loading: false});
                    getUser();
                    history.push(match.url.split('/').slice(0, 5).join('/'));
                }
                else if (res.error && res.error.response && res.error.response.status === 400 && res.error.response.data && res.error.response.data.detail) {
                    this.openDialog(res.error.response.data.detail);
                    this.setState({loading: false});
                    throw new SubmissionError({...res.error.response.data, _error: 'Add channel failed.'});
                }
                else {
                    this.setState({loading: false});
                    throw new SubmissionError({...res.error.response.data, _error: 'Add channel failed.'});
                }
            });
        }
    };

    openDialog = (value) => {
        this.setState({open: true, dialogMessage: value});
    };

    closeDialog = () => {
        this.setState({open: false});
    };

    changeRadio = event => {
        const {dispatch} = this.props;
        if(event.target.value === 'default_true'){
            dispatch(change('EditChannelForm', 'specific', 'specific_false'));
            dispatch(untouch('EditChannelForm', 'specific'));
            dispatch(untouch('EditChannelForm', 'specific_fee'));
        }
        else {
            dispatch(change('EditChannelForm', 'default', 'default_false'));
            dispatch(untouch('EditChannelForm', 'default'));
        }
    };

    changeAlgorithm = (e) => {
        const {dispatch, channels:{internal_wallets}} = this.props;
        this.setState({currentCurrency: internal_wallets[e.target.value].currency});
        dispatch(change('EditChannelForm', 'default_address', internal_wallets[e.target.value].address));
        dispatch(untouch('EditChannelForm', 'default_address'));
    };

    render(){
        const { handleSubmit, submitting, pristine, error, history, match, channelType, clients:{client_detail}, channels:{channel_detail, platforms, internal_wallets, channels_inner_error}, deleteChannel}  = this.props;
        const { loading, loadingPage, notFound, loadingPlatforms, loadingWallets, success , open, currentCurrency, dialogMessage} = this.state;
        let breadItems = [
            {url: '/admin/clients', name: 'Clients'},
            {url: `/admin/clients/${client_detail.id}/inner/channels`, name: client_detail.name },
            {url: null, name: this.id ? channel_detail.name : 'Add Channel' }
        ];
        if(notFound) return <NoMatch/>;
        else if(loadingPage || loadingPlatforms || loadingWallets) return <Loader class="page_client_inner"/>;
        return (
            <div>
                <div>
                    <BreadCrumbs items={breadItems}/>
                </div>
                <div className="page_header display_edit_client">
                    <h2>{this.id ? `${channel_detail.name}` : 'Add Channel'}</h2>
                </div>
                <div className="page_content_wrapper">
                    <form onSubmit={handleSubmit(this.SubmitForm)}>
                        <div className="block_container block_inner block_distance">
                            <div className="fields_wrapper">
                                <Field name="name" type="text" classes="edit_input" component={RenderField} label="Name" validate={[required]} />
                                <Field name="algorithm" component={RenderSelect} onChange={this.changeAlgorithm} classes={this.id ? "disable_field" : null} label="Algorithm" disable={this.id} validate={[required]}>
                                    {platforms && platforms.length ?
                                        platforms.map((el, i)=>(
                                            <MenuItem value={el} key={i}>{el}</MenuItem>
                                        ))
                                        :
                                        null
                                    }
                                </Field>
                            </div>

                            {client_detail.mode === 'FM' ?
                                <div className="channel_editing">
                                    <p className="wallets-info">
                                        ‘Mining’ mode transit internal wallet:
                                    </p>

                                    <div className="channels_radio_block">
                                        <Field
                                            name="default"
                                            onChange={this.changeRadio}
                                            component={RenderRadio}
                                        >
                                            <FormControlLabel
                                                value="default_true"
                                                control={<Radio />}
                                                label={<div className="radio_descriptions"><h5>Use the default transit internal client’s wallet for this channel</h5></div>}
                                            />
                                        </Field>

                                        <div className="channel_field_wrapper">
                                            <Field
                                                name="default_address"
                                                type="text"
                                                classes={channelType !== 'default_true' ? "edit_input full_disable_field" : "edit_input disable_input"}
                                                component={RenderField}
                                                disabled
                                                label={`${currentCurrency} Wallet`}
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
                                                label={<div className="radio_descriptions"><h5>{this.id ? "Use the generated specific transit client’s wallet for this channel" : "Generate a specific transit internal client’s wallet for this channel*"}</h5></div>}
                                            />
                                        </Field>

                                        {this.id ?
                                            <div className="channel_field_wrapper channel_wallet_field">
                                                <Field
                                                    name="specific_address"
                                                    type="text"
                                                    classes={channelType === 'default_true' ? "edit_input disable_field" : "edit_input disable_input"}
                                                    component={RenderField}
                                                    disabled
                                                    validate={channelType !== 'default_true' ? [required] : null}
                                                    label={`${currentCurrency} Wallet`}
                                                />
                                            </div>
                                            :
                                            null
                                        }
                                        <Field
                                            name="specific_fee"
                                            type="number"
                                            classes={channelType === 'default_true' ? "edit_input small_field field_symbol_wrapper disable_input" : "edit_input small_field field_symbol_wrapper"}
                                            symbol="%"
                                            component={RenderField}
                                            disabled={channelType === 'default_true'}
                                            validate={channelType !== 'default_true' ? [required, percents, symbolsAfterDot] : null}
                                            label="Specific Fee"
                                        />

                                    </div>
                                    {!this.id ?
                                        <p className="generate-info">
                                            *Our system will automatically generate a specific wallet for this channel
                                            as you click the «Save» button.
                                        </p>
                                        :
                                        null
                                    }
                                </div>
                                :
                                null
                            }


                        </div>
                        <div className="block_container block_inner btn_wrapper">
                            {!this.id ?
                                <ActionButton
                                    text="cancel"
                                    class="cancel"
                                    type="link"
                                    disabled={loading}
                                    href={match.url.split('/').slice(0, 5).join('/')}
                                />
                                :
                                null
                            }
                            {this.id ?
                                <DeleteComponent
                                    id={[client_detail.id, channel_detail.id]}
                                    text={`Do you really want to delete the channel «${channel_detail.name}»?`}
                                    onDelete={deleteChannel}
                                    redirect={match.url.split('/').slice(0, 5).join('/')}
                                    disabled={success}
                                    history={history}
                                    type='Delete'
                                />
                                :
                                null
                            }
                            {!loading ?
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
                            {channels_inner_error.detail ? <div className="page_error"><img src={ErrorIcon} alt="icon"/>{getError(channels_inner_error)}</div> : null}
                        </div>
                    </form>
                </div>

                <DialogComponent
                    open={open}
                    dialogClose={this.closeDialog}
                >
                    <div className="dialog_delete_wrapper">
                        <img src={AttentionIcon}/>
                        <span className="dialog_message">{dialogMessage !== '' ? dialogMessage : null}</span>
                        <div className="flex-center btn_wrapper_wide">
                            <ActionButton
                                text="GO TO SETTINGS"
                                class="save"
                                type="link"
                                href="/admin/settings"
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

EditChannelForm.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

EditChannelForm = reduxForm({
    form: 'EditChannelForm',
    enableReinitialize: true
})(EditChannelForm);

const selector = formValueSelector('EditChannelForm');

function mapStateToProps(state, props) {
    const channelType = selector(state, 'default');
    return{
        channelType,
        clients: state.clients,
        channels: state.channels,
        initialValues: {
            name: props.match.params.channel !== 'add-channel' && state.channels.channel_detail.name || '',
            algorithm: props.match.params.channel !== 'add-channel' && state.channels.channel_detail.algorithm || state.channels.platforms[0],
            default_address: props.match.params.channel !== 'add-channel' && state.channels.channel_detail.default_address || state.channels.internal_wallets['SHA-256'] && state.channels.internal_wallets['SHA-256'].address,
            specific_address: state.channels.channel_detail && state.channels.channel_detail.specific_address || '',
            specific_fee: state.channels.channel_detail && state.channels.channel_detail.specific_fee || '',
            default: props.match.params.channel !== 'add-channel' && state.channels.channel_detail.wallet_to_use === 'default' ? `${state.channels.channel_detail.wallet_to_use}_true` : props.match.params.channel === 'add-channel' ? 'default_true' : 'default_false',
            specific: props.match.params.channel !== 'add-channel' && state.channels.channel_detail.wallet_to_use === 'specific' ? `${state.channels.channel_detail.wallet_to_use}_true` : 'specific_false',
        }
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        postAddChannel,
        getChannelDetail,
        getInternalWallets,
        getPlatforms,
        patchEditChannel,
        deleteChannel,
        getUser
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditChannelForm);