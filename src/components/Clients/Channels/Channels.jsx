import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import {client_items} from "../../../helpers/navigation-items";
import Navigation from '../../Navigation/Navigation';
import IconButton from '@material-ui/core/IconButton';
import BreadCrumbs from '../../BreadCrumbs/BreadCrumbs';
import TooltipMessage from '../../HelpersBlocks/TooltipMessage/TooltipMessage';
import DeleteComponent from '../../Clients/DeleteComponent/DeleteComponent';
import {getOptionForClient} from "../../../helpers/functions";
import TableLoader from '../../TableLoader/TableLoader';
import DestinationChange from './DestinationChange/DestinationChange';
import DialogComponent from '../../HelpersBlocks/DialogComponent/DialogComponent';
import ActionButton from '../../Buttons/ActionButton/ActionButton';
import BalanceTopUp from '../../Header/BalanceTopUp/BalanceTopUp';
import Pagination from '../../Pagination/Pagination';
import {symbolHash, toFixedHash} from "../../../helpers/hashrateConvert";

import {getChannels, deleteChannel} from "../../../actions/channelsActions";

import AddIcon from '@material-ui/icons/Add';
import SuccessIcon from '../../../../assets/img/success_icon.png';
import ErrorIcon from '../../../../assets/img/error_icon.png';
import EditIconPencil from '../../../../assets/img/edit_icon_pencil.png';
import DeleteIconTrash from '../../../../assets/img/delete_icon_trash.png';
import HashrateIcon from '../../../../assets/img/hashrate_icon.png';
import AttentionIcon from '../../../../assets/img/attention-icon.png';
import InfoIcon from '../../../../assets/img/info_icon.png';
import ExitDialog from '../../../../assets/img/exit.png';

import './Channels.scss';

class Channels extends Component {
    constructor(props) {
        super(props);
        const { match } = this.props;
        let pathArr = match.url.split('/');
        this.prevPath  = pathArr.slice(0, pathArr.length - 1).join('/');
        this.state = {
            loading: true,
            empty: false,
            open: false,
            topUpBalance: false,
            activePage: 1
        };
    }

    componentDidMount(){
        const {activePage} = this.state;
        this.doRequest(activePage);
    }

    componentWillUnmount(){
        this.props.channels.channels_list = {};
    }

    doRequest = (page) => {
        const {getChannels, clients:{client_detail:{id}}} = this.props;
        this.setState({loading: true});
        getChannels(id, page).then((res)=>{
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

    changePage = pageNumber => {
        this.setState({activePage: pageNumber});
        this.doRequest(pageNumber);
    };

    openDialog = () => {
        this.setState({open: true, topUpBalance: false});
    };

    dialogClose = () => {
        this.setState({open: false});
    };

    openTopUp = () => {
        this.setState({open: false});
        setTimeout(()=>{
            this.setState({topUpBalance: true});
        }, 200);
    };

    render(){
        const {match, clients:{client_detail, client_detail:{name, status, id}}, channels:{channels_list}, user:{user_info}, deleteChannel} = this.props;
        const {empty, loading, open, topUpBalance, activePage} = this.state;
        let breadItems = [
            {url: '/admin/clients', name: 'Clients' },
            {url: null, name: name }
        ];
        return (
            <div className="channels_page">
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
                        <div className="channel_options_container">
                            <div className="page_add_btn">
                                {user_info.balance >= 5 ?
                                    <Link to={`${match.url}/add-channel`}>
                                        <Button variant="outlined">
                                            <AddIcon/>
                                            Add Channel
                                        </Button>
                                    </Link>
                                    :
                                    <Button variant="outlined" onClick={this.openDialog}>
                                        <AddIcon/>
                                        Add Channel
                                    </Button>
                                }
                            </div>
                        </div>

                        <div className="table_container channels_columns">
                            <div className="table_header">
                                <div className="table_row">
                                    <p>Name</p>
                                    <p>Algorithm</p>
                                    <p>Pool Host: Port</p>
                                    <p>Hashrate</p>
                                    <p>Hashrate(24h)</p>
                                    <p>Workers (active/inactive/all)</p>
                                    <p>Cost/h</p>
                                    <p>Destination pool</p>
                                    <p>Status</p>
                                    <p>Auto Switch</p>
                                    <p>Rent</p>
                                    <p></p>
                                </div>
                            </div>
                            <div className="table_body">
                                {!empty && channels_list.results && channels_list.results.length ?
                                    channels_list.results.map(({id, name, algorithm, domains, destination, hashrate, hashrate24, workers, cost_per_hour, issues, auto_switch, rent, watcher_url})=>{
                                        let ids = [client_detail.id, id];
                                        return (
                                            <div className="table_row" key={id}>
                                                <p className="medium_text">
                                                    <TooltipMessage
                                                        text={name}
                                                        position="top-start"
                                                    >
                                                        <Link to={`${match.url}/${id}/channel-inner`}>
                                                            {name}
                                                        </Link>
                                                    </TooltipMessage>
                                                </p>
                                                <p className="gray_text">{algorithm}</p>
                                                {domains.length && domains.length !== 0 ?
                                                    <div className="cell_centered port_icon">
                                                        {domains.map((el, i)=>(
                                                            <div  key={i} className="port-wrapper">
                                                                <div className="port" ><p className="gray_text">{el}</p></div>
                                                                <div className="info-port"><img src={InfoIcon} alt="info-port"/><i>{el}</i></div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    :
                                                    <p></p>
                                                }
                                                <p className="gray_text">{`${toFixedHash(hashrate)} ${symbolHash(hashrate)}`}</p>
                                                <p className="gray_text">{`${toFixedHash(hashrate24)} ${symbolHash(hashrate24)}`}</p>
                                                <p className="gray_text">
                                                    <span className="success_text">{workers[0]}</span>/
                                                    <span className="fail_text">{workers[1]}</span>/
                                                    <span className="medium_text">{workers[2]}</span>
                                                </p>
                                                <p className="gray_text">$ {cost_per_hour}</p>
                                                <div className="gray_text">
                                                    {destination[0] === 'Rent' ?
                                                        <span className="rent_attention">
                                                            <img src={AttentionIcon} alt="attention"/>
                                                            Rent
                                                        </span>
                                                        :
                                                        <DestinationChange
                                                            value={destination[0]}
                                                            data={destination}
                                                            ids={[client_detail.id, id]}
                                                            auto_switch={auto_switch}
                                                        />
                                                    }
                                                </div>
                                                {issues === 0 ?
                                                    <p className="cell_centered gray_text status_channel">
                                                        <img src={SuccessIcon}/>
                                                        OK
                                                    </p>
                                                    :
                                                    <p className="cell_centered gray_text status_channel">
                                                        <img src={ErrorIcon}/>
                                                        <Link to={`${match.url}/${id}/channel-inner/issues`} className="underline_btn_table">{issues} Issues</Link>
                                                    </p>
                                                }
                                                <p>
                                                    {auto_switch ?
                                                        <span className="success_text">On</span>
                                                        :
                                                        <span className="fail_text">Off</span>
                                                    }
                                                </p>
                                                <p>
                                                    {rent ?
                                                        <span className="success_text">On</span>
                                                        :
                                                        <span className="fail_text">Off</span>
                                                    }
                                                </p>
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
                                                    <TooltipMessage text="Edit channel">
                                                        <Link to={`${match.url}/${id}/channel-inner/channel-settings`}>
                                                            <IconButton>
                                                                <img src={EditIconPencil}/>
                                                            </IconButton>
                                                        </Link>
                                                    </TooltipMessage>
                                                    <DeleteComponent
                                                        id={ids}
                                                        text={`Do you really want to delete the channel «${name}»?`}
                                                        tooltip="Delete channel"
                                                        onDelete={deleteChannel}
                                                        request={()=>{this.doRequest(activePage)}}
                                                        icon={DeleteIconTrash}
                                                        type='icon'
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })
                                    :
                                    empty ?
                                        <div className="table_row">
                                            <p>No items</p>
                                            <p></p>
                                        </div>
                                        :
                                        null
                                }
                            </div>
                            {channels_list.count && channels_list.count > 10 ?
                                <Pagination
                                    current={activePage}
                                    pageCount={10}
                                    total={channels_list.count}
                                    onChange={this.changePage}
                                />
                                :
                                null
                            }
                        </div>
                    </div>
                </div>
                <DialogComponent
                    open={open}
                    dialogClose={this.dialogClose}
                >
                    <div className="dialog_delete_wrapper">
                        <img src={AttentionIcon}/>
                        <div>
                            <p className="dialog_message">You don’t have enough money to add a<br/>channel. Please top up your balance</p>
                        </div>
                        <div className="btn_wrapper_wide">
                            <ActionButton
                                text="Top up"
                                class="save"
                                type="button"
                                full
                                action={this.openTopUp}
                            />
                        </div>
                        <div className="exit-dialog" onClick={this.dialogClose}>
                            <img src={ExitDialog} alt="exit"/>
                        </div>
                    </div>
                </DialogComponent>
                {topUpBalance ?
                    <BalanceTopUp
                        user={user_info}
                        dialog
                    />
                    :
                    null
                }
            </div>
        );
    }
}

Channels.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

function mapStateToProps(state) {
    return{
        channels: state.channels,
        clients: state.clients,
        user: state.user
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getChannels,
        deleteChannel
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Channels);