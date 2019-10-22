import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {Link} from 'react-router-dom';
import {client_items} from "../../../helpers/navigation-items";
import Navigation from '../../Navigation/Navigation';
import BreadCrumbs from '../../BreadCrumbs/BreadCrumbs';
import Button from '@material-ui/core/Button';
import DeleteComponent from '../DeleteComponent/DeleteComponent';
import TooltipMessage from '../../HelpersBlocks/TooltipMessage/TooltipMessage';
import VerifyPoolComponent from './VerifyPoolComponent/VerifyPoolComponent';
import TableLoader from '../../TableLoader/TableLoader';
import OrderButton from '../../Buttons/OrderButton/OrderButton';
import MakePrimary from './MakePrimary/MakePrimary';
import {getOptionForClient} from "../../../helpers/functions";
import {arrayAlgorithms} from "../../../helpers/helpers";

import {getPools, deletePool} from "../../../actions/poolsActions";

import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import EditIconPencil from '../../../../assets/img/edit_icon_pencil.png';
import DeleteIconTrash from '../../../../assets/img/delete_icon_trash.png';
import HashrateIcon from '../../../../assets/img/hashrate_icon.png';

import './Pools.scss';


class Pools extends Component {
    constructor(props) {
        super(props);
        const { match } = props;
        let pathArr = match.url.split('/');
        this.prevPath  = pathArr.slice(0, pathArr.length - 2).join('/');
        pathArr[pathArr.length - 1] = arrayAlgorithms.includes(match.params.algorithm) ? match.params.algorithm : 'SHA-256';
        props.history.push(pathArr.join('/'));
        this.state = {
            active_tab: arrayAlgorithms.includes(match.params.algorithm) ? match.params.algorithm : 'SHA-256',
            order: null,
            loading: false,
            empty: false,
            open: false
        }
    }

    componentDidMount(){
        const {active_tab, order} = this.state;
        this.doRequest(active_tab, order);
    }

    componentWillUnmount(){
        this.props.pools.pools_list = [];
    }

    doRequest = (algorithm, order) => {
        const {getPools, clients:{client_detail:{id}}} = this.props;

        let params = [];
        params.push( `algorithm=${algorithm}`);
        if(order !== null) {
            params.push(`ordering=${order}`);
        }

        this.setState({empty: false, loading: true});
        getPools(id, params).then((res)=>{
            if(res.payload && res.payload.status && res.payload.status === 200){
                this.setState({loading: false});
                if(res.payload.data.length === 0){
                    this.setState({empty: true});
                }
            }
            else {
                this.setState({loading: false});
            }
        });
    };

    filterTab = (field) => {
        const {history, match} = this.props;
        const {order} = this.state;
        history.push(`${match.url.split('/').slice(0, 6).join('/')}/${field}`);
        this.setState({active_tab: field});
        this.doRequest(field, order)
    };

    sortData = (field) => {
        const { active_tab, order } = this.state;
        let ord = '';
        if(order === `-${field}`) ord = field;
        else if (order === field) ord = `-${field}`;
        else ord = field;
        this.setState({order: ord});
        this.doRequest(active_tab, ord);
    };

    render(){
        const {match, clients:{client_detail, client_detail:{name, id, status}}, pools:{pools_list}, deletePool} = this.props;
        const {active_tab, order, loading, empty} = this.state;
        let breadItems = [
            {url: '/admin/clients', name: 'Clients' },
            {url: null, name: name }
        ];
        return (
            <div className="pools_page">
                <BreadCrumbs items={breadItems}/>
                <div className="page_header">
                    <h2>{name}</h2>
                    <div className="client_status_container">
                        {getOptionForClient(status, id, name, 'large')}
                    </div>
                </div>
                <div className="page_content_wrapper">
                    <Navigation
                        path={this.prevPath}
                        items={client_items}
                    />
                    <div className="info_page_wrapper">
                        {loading ? <TableLoader/> : null}
                        <div className="table_container pools_columns">
                            <div className="table_options_container">
                                <div className="table_tabs">
                                    <button
                                        className={active_tab === 'SHA-256' ? "active_table_tab" : null}
                                        onClick={()=>{this.filterTab('SHA-256')}}
                                        disabled={active_tab === 'SHA-256'}
                                    >
                                        SHA-256
                                    </button>
                                    <button
                                        className={active_tab === 'Ethash' ? "active_table_tab" : null}
                                        onClick={()=>{this.filterTab('Ethash')}}
                                        disabled={active_tab === 'Ethash'}
                                    >
                                        Ethash
                                    </button>
                                    <button
                                        className={active_tab === 'Scrypt' ? "active_table_tab" : null}
                                        onClick={()=>{this.filterTab('Scrypt')}}
                                        disabled={active_tab === 'Scrypt'}
                                    >
                                        Scrypt
                                    </button>
                                </div>
                                <div className="channel_options_container">
                                    <div className="page_add_btn">
                                        <Link to={`${match.url}/add-pool`}>
                                            <Button variant="outlined">
                                                <AddIcon/>
                                                Add Config
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="table_header">
                                <div className="table_row">
                                    <OrderButton
                                        text="Title"
                                        order={order}
                                        field={'name'}
                                        sort={()=>{this.sortData('name')}}
                                        disabled={empty}
                                    />
                                    <OrderButton
                                        text="Pool Address"
                                        order={order}
                                        field={'host'}
                                        sort={()=>{this.sortData('host')}}
                                        disabled={empty}
                                    />
                                    <OrderButton
                                        text="Coin"
                                        order={order}
                                        field={'currency'}
                                        sort={()=>{this.sortData('currency')}}
                                        disabled={empty}
                                    />
                                    <OrderButton
                                        text="Pool Port"
                                        order={order}
                                        field={'port'}
                                        sort={()=>{this.sortData('port')}}
                                        disabled={empty}
                                    />
                                    <OrderButton
                                        text="User Name/Wallet"
                                        order={order}
                                        field={'username'}
                                        sort={()=>{this.sortData('username')}}
                                        disabled={empty}
                                    />
                                    <OrderButton
                                        text="Password"
                                        order={order}
                                        field={'password'}
                                        sort={()=>{this.sortData('password')}}
                                        disabled={empty}
                                    />
                                    <p></p>
                                    <p></p>
                                    <p></p>
                                </div>
                            </div>
                            <div className="table_body">
                                {!empty && pools_list.length ?
                                    pools_list.map(({id, name, host, currency, port, username, password, primary, algorithm, watcher_url})=> {
                                        let ids = [client_detail.id, id];
                                        return (
                                            <div className="table_row" key={id}>
                                                <p className="medium_text">
                                                    <Link to={`${match.url}/${id}`}>
                                                        {name}
                                                    </Link>
                                                </p>
                                                <p className="gray_text">{host}</p>
                                                <p className="gray_text">{currency}</p>
                                                <p className="gray_text">{port}</p>
                                                <p className="gray_text">{username}</p>
                                                <p className="gray_text">{password}</p>
                                                {primary ?
                                                    <p className="gray_text">
                                                        <span className="success_text">Primary</span>
                                                    </p>
                                                    :
                                                    <MakePrimary
                                                        id={id}
                                                        client_id={client_detail.id}
                                                        name={name}
                                                        currency={currency}
                                                    />
                                                }
                                                <div className="gray_text">
                                                    <VerifyPoolComponent
                                                        data={{
                                                            host: host,
                                                            username: username,
                                                            port: port,
                                                            password: password
                                                        }}
                                                        algorithm={algorithm}
                                                    />
                                                </div>
                                                <div className="table_options_end channels_options_btn">
                                                    {watcher_url !== null && watcher_url !== "" ?
                                                        <a href={watcher_url} target="_blank">
                                                            <IconButton>
                                                                <img src={HashrateIcon}/>
                                                            </IconButton>
                                                        </a>
                                                        :
                                                        null
                                                    }
                                                    <TooltipMessage text="Edit pool">
                                                        <Link to={`${match.url}/${id}`}>
                                                            <IconButton>
                                                                <img src={EditIconPencil}/>
                                                            </IconButton>
                                                        </Link>
                                                    </TooltipMessage>
                                                    <DeleteComponent
                                                        id={ids}
                                                        text={<span>Do you really want to delete pool config <br/>«{name}»?</span>}
                                                        tooltip="Delete pool"
                                                        onDelete={deletePool}
                                                        icon={DeleteIconTrash}
                                                        type='icon'
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })
                                    :
                                    empty ?
                                        <div className="table_row">
                                            <p className="table_no_items">No items</p>
                                            <p></p>
                                        </div>
                                        :
                                        null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Pools.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

function mapStateToProps(state) {
    return{
        clients: state.clients,
        pools: state.pools
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getPools,
        deletePool
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Pools);