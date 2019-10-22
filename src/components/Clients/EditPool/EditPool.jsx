import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Field, reduxForm, SubmissionError, formValueSelector, change, untouch} from 'redux-form';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import BreadCrumbs from '../../BreadCrumbs/BreadCrumbs';
import RenderField from "../../HelpersBlocks/RenderField/RenderField";
import RenderSelect from "../../HelpersBlocks/RenderSelect/RenderSelect";
import {required, minLength} from "../../../helpers/validation";
import ActionButton from '../../Buttons/ActionButton/ActionButton';
import MenuItem from '@material-ui/core/MenuItem';
import DeleteComponent from '../DeleteComponent/DeleteComponent';
import Loader from "../../Loader/Loader";
import {getError} from "../../../helpers/functions";
import DialogComponent from '../../HelpersBlocks/DialogComponent/DialogComponent';
import VerifyPool from '../Pools/VerifyPool/VerifyPool';
import NoMatch from '../../../containers/NoMatch/NoMatch';
import {poolAddress} from "../../../helpers/normalize";

import {postAddPool, getPoolDetail, patchEditPool, deletePool, getCurrenciesSymbols} from "../../../actions/poolsActions";

import ErrorIcon from '../../../../assets/img/error_icon.png';

import './Editpool.scss';


class EditPool extends Component {
    constructor(props){
        super(props);
        const {match} = this.props;
        this.id = match.params.pool !== 'add-pool';
        this.state = {
            loadingPage: false,
            loadingCurrencies: false,
            loading: false,
            open: false,
            notFound: false
        };
    }

    componentDidMount(){
        const {getCurrenciesSymbols, getPoolDetail, match:{params:{pool}}, clients:{client_detail:{id}}, pools:{pool_detail, currencies_symbols}} = this.props;
        if(!currencies_symbols || !currencies_symbols.SHA_256 || !currencies_symbols.SHA_256.length) {
            this.setState({loadingCurrencies: true});
            getCurrenciesSymbols().then(()=>{
                this.setState({loadingCurrencies: false});
            });
        }
        if(this.id && pool !== 'add-pool'){
            this.setState({loadingPage: true});
            getPoolDetail(id, pool).then(res=>{
                this.setState({loadingPage: false});
                if(res.error && res.error.response && res.error.response.status === 404){
                    this.setState({notFound: true});
                }
            });
        }
    }

    SubmitForm=(data)=>{
        const {postAddPool, patchEditPool, match:{params:{pool}}, history, clients:{client_detail:{id}}, match} = this.props;
        this.setState({loading: true});
        if(this.id){
            return patchEditPool(id, pool, data).then((res)=>{
                if(res.payload && res.payload.status && res.payload.status === 200){
                    this.setState({loading: false});
                    history.push(match.url.split('/').slice(0, 6).join('/'));
                }
                else {
                    this.setState({loading: false});
                    throw new SubmissionError({...res.error.response.data, _error: 'Edit pool failed'});
                }
            });
        }
        else {
            return postAddPool(id, data).then((res)=>{
                if(res.payload && res.payload.status && res.payload.status === 201){
                    this.setState({loading: false});
                    history.push(match.url.split('/').slice(0, 6).join('/'));
                }
                else {
                    this.setState({loading: false});
                    throw new SubmissionError({...res.error.response.data, _error: 'Add pool failed'});
                }
            });
        }
    };

    changeAlgorithm = () => {
        const {dispatch} = this.props;
        dispatch(change('EditPool', 'currency', null));
        dispatch(untouch('EditPool', 'currency'));
    };

    openDialog = () => {
        this.setState({open: true});
    };

    closeDialog = () => {
        this.setState({open: false});
    };

    render(){
        const { handleSubmit, submitting, pristine, match, error, history, formValues, algorithmType, pools:{pool_detail, currencies_symbols, pools_inner_error}, clients:{client_detail:{id, name}}, deletePool } = this.props;
        const {loadingPage, loadingCurrencies, loading, notFound, open} = this.state;
        let breadItems = [
            {url: '/admin/clients', name: 'Clients' },
            {url: `/admin/clients/${id}/inner/pools`, name: name },
            {url: null, name: this.id ? pool_detail.name : 'add pool' }
        ];
        if(notFound) return <NoMatch/>;
        else if(loadingPage || loadingCurrencies) return <Loader class="page" />;
        return (
            <div className="clients_page">
                <BreadCrumbs items={breadItems}/>
                <div className="page_header">
                    <h2>{this.id ? pool_detail.name : 'Add Pool'}</h2>
                </div>
                <div className="page_content_wrapper">
                    <form onSubmit={handleSubmit(this.SubmitForm)}>
                        <div className="block_container block_inner block_distance">
                            <div className="fields_wrapper_pool">
                                <div className="pool_edit_fields_wrapper">
                                    <div>
                                        <div className="double_fields_wrapper">
                                            <Field name="name" type="text" classes="edit_input half_width_text_field" component={RenderField} label="Title" validate={[required]} />
                                            <Field name="algorithm" classes="half_width_select_field" onChange={this.changeAlgorithm} component={RenderSelect} disable={this.id} label="Algorithm" validate={[required]}>
                                                <MenuItem value="SHA-256">SHA-256</MenuItem>
                                                <MenuItem value="Scrypt">Scrypt</MenuItem>
                                                <MenuItem value="Ethash">Ethash</MenuItem>
                                            </Field>
                                        </div>
                                        <Field name="host" type="text" classes="edit_input full_width_text_field pre_label_pool_address" component={RenderField} label="Pool Address" preLabel="stratum+tcp://" validate={[required]} normalize={poolAddress} />
                                        <Field name="username" type="text" classes="edit_input full_width_text_field" component={RenderField} label="User Name/Wallet" validate={[required]} />
                                    </div>
                                    <div>
                                        <Field name="currency" classes="edit_input full_width_select_field" component={RenderSelect} label="Coin" validate={[required]}>
                                            {currencies_symbols.SHA_256 && currencies_symbols.SHA_256.length && algorithmType !== undefined ?
                                                currencies_symbols[algorithmType.replace(/-/gi, '_')].map((el, i)=>(
                                                    <MenuItem value={el} key={i}>{el}</MenuItem>
                                                ))
                                                :
                                                null
                                            }
                                        </Field>
                                        <Field name="port" type="text" classes="edit_input full_width_text_field" component={RenderField} label="Pool Port" validate={[required]} />
                                        <Field name="password" type="text" classes="edit_input full_width_text_field" component={RenderField} label="Password" />
                                    </div>
                                </div>
                                <Field name="watcher_url" type="text" classes="edit_input full_width_text_field" component={RenderField} label="Mining Monitor URL (optional)" />
                            </div>
                        </div>
                        <div className="block_container block_inner btn_wrapper">
                            <ActionButton
                                text="cancel"
                                class="cancel"
                                type="link"
                                href={match.url.split('/').slice(0, 7).join('/')}
                            />
                            {this.id ?
                                <DeleteComponent
                                    id={[id, pool_detail.id]}
                                    text={`Do you really want to terminate the contract with «${pool_detail.name}»?`}
                                    onDelete={deletePool}
                                    redirect={match.url.split('/').slice(0, 7).join('/')}
                                    history={history}
                                    type='Delete'
                                />
                                :
                                null
                            }
                            <ActionButton
                                text="verify"
                                class="verify"
                                type="button"
                                action={this.openDialog}
                            />
                            {!loading ?
                                <ActionButton
                                    text="save"
                                    class="save"
                                    type="button"
                                    disabled={submitting || pristine || Boolean(error)}
                                    formAction
                                />
                                :
                                <Loader class="btn"/>
                            }
                            {error !== undefined ? <p className="page_error"><img src={ErrorIcon} alt="icon"/>{error}</p> : null}
                            {pools_inner_error && pools_inner_error.detail ? <div className="page_error"><img src={ErrorIcon} alt="icon"/>{getError(pools_inner_error)}</div> : null}
                        </div>
                    </form>
                </div>
                <DialogComponent
                    open={open}
                    dialogClose={this.closeDialog}
                >
                    <VerifyPool
                        closeAction={this.closeDialog}
                        data={formValues}
                        algorithm={formValues.algorithm}
                    />
                </DialogComponent>
            </div>
        );
    }
}

EditPool.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

EditPool = reduxForm({
    form: 'EditPool',
    enableReinitialize: true
})(EditPool);

function mapStateToProps(state, props) {
    const selector = formValueSelector('EditPool');
    const algorithmType = selector(state, 'algorithm');
    let search = new URLSearchParams(props.location.search.substring(1));
    let coin = decodeURIComponent(search.get('coin'));
    return{
        algorithmType,
        clients: state.clients,
        pools: state.pools,
        initialValues: {
            host:           props.match.params.pool !== 'add-pool' && state.pools.pool_detail.host || '',
            algorithm:      props.match.params.pool !== 'add-pool' && state.pools.pool_detail.algorithm || props.match.params.pool === 'add-pool' && props.match.params.algorithm ||'SHA-256',
            name:           props.match.params.pool !== 'add-pool' && state.pools.pool_detail.name || '',
            username:       props.match.params.pool !== 'add-pool' && state.pools.pool_detail.username || '',
            currency:       props.match.params.pool !== 'add-pool' && state.pools.pool_detail.currency || coin !== 'null' && coin || '',
            watcher_url:    props.match.params.pool !== 'add-pool' && state.pools.pool_detail.watcher_url || '',
            port:           props.match.params.pool !== 'add-pool' && state.pools.pool_detail.port || '',
            password:       props.match.params.pool !== 'add-pool' && state.pools.pool_detail.password || '',
        },
        formValues: selector(state, 'host', 'port', 'username', 'password', 'algorithm')
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        postAddPool,
        getPoolDetail,
        patchEditPool,
        deletePool,
        getCurrenciesSymbols
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPool);