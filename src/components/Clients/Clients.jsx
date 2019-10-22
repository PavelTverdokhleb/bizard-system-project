import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import {Link} from 'react-router-dom';
import {getError} from "../../helpers/functions";
import TooltipMessage from '../HelpersBlocks/TooltipMessage/TooltipMessage';
import TableLoader from '../TableLoader/TableLoader';
import DeleteComponent from './DeleteComponent/DeleteComponent';
import Pagination from '../Pagination/Pagination';
import {getOptionForClient} from "../../helpers/functions";

import {
    getClients,
    postInviteClient,
    deleteClient
} from "../../actions/clientsActions";
import {
    updateClient
} from "../../actions/updateRedux";

import AddIcon from '@material-ui/icons/Add';
import EditIcon from '../../../assets/img/edit_icon.png';
import DeleteIcon from '../../../assets/img/delete_icon.png';
import SearchIcon from '../../../assets/img/search_icon.png';

import './Clients.scss';

class Clients extends Component {
    state = {
        loading: true,
        empty: false,
        activePage: 1,
        search: '',
        lastSearchRequest: ''
    };

    componentDidMount(){
        this.doRequest(1);
    }

    componentWillUnmount(){
        this.props.clients.clients_list = {};
    }

    doRequest = (page) => {
        const {getClients} = this.props;
        const {search} = this.state;

        let term = '';
        if(search !== '') {
            term = `search=${encodeURIComponent(search)}&`;
        }

        this.setState({loading: true, empty: false});
        getClients(term, page).then((res)=>{
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

    changePage = (pageNumber) => {
        this.setState({activePage: pageNumber});
        this.doRequest(pageNumber);
    };

    handleSearch = (e) => {
        if (e.keyCode === 13) document.getElementById('search_clients').blur();
    };

    searchBlur = (e) => {
        const {lastSearchRequest} = this.state;
        if (e.target.value !== lastSearchRequest && e.keyCode !== 13) {
            this.setState({activePage: 1, lastSearchRequest: e.target.value});
            this.doRequest(1);
        }
    };

    handleSearchChange = (e) => {
        this.setState({search: e.target.value});
    };

    render(){
        const {match, clients: {clients_list, clients_error}, deleteClient} = this.props;
        const {loading, empty, activePage, search} = this.state;
        let path = match.url[match.url.length - 1] == '/' ? match.url : match.url + '/';
        return (
            <div className="clients_page">
                <div className="page_header options_header">
                    <h2>Clients</h2>
                    <div className="page_add_btn">
                        <div className="table_search">
                            <input
                                type="text"
                                id="search_clients"
                                className="workers-search"
                                onKeyDown={this.handleSearch}
                                onChange={this.handleSearchChange}
                                onBlur={this.searchBlur}
                                value={search}
                                placeholder="Search"
                            />
                            <span className="search_icon"><img src={SearchIcon}/></span>
                        </div>
                        <Link to={`${path}add`}>
                            <Button variant="outlined">
                                <AddIcon/>
                                Add Client
                            </Button>
                        </Link>
                    </div>
                </div>
                {clients_error.length !== 0 ? <div className="page_error">{getError(clients_error)}</div> : null}
                <div className="table_container clients_columns">
                    {loading ? <TableLoader/> : null}
                    <div className="table_header">
                        <div className="table_row">
                            <p>Name</p>
                            <p>Email</p>
                            <p>Mode</p>
                            <p>Status</p>
                            <p></p>
                        </div>
                    </div>
                    {!empty && clients_list.results && clients_list.results.length ?
                        <div className="table_body">
                            {clients_list.results.map(({id, name, email, mode, status})=>(
                                <div className="table_row" key={id}>
                                    <p className="medium_text">
                                        <Link to={`${path}${id}/inner`}>
                                            {name}
                                        </Link>
                                    </p>
                                    <p>{email}</p>
                                    <p>
                                        {mode === 'FM' ?
                                            'Finances & Monitoring'
                                            :
                                            'Monitoring'
                                        }
                                    </p>
                                    <div>{getOptionForClient(status, id, name)}</div>
                                    <div className="table_options_end">
                                        <Link to={`${path}${id}/inner/settings`}>
                                            <TooltipMessage text="Edit client">
                                                <IconButton>
                                                    <img src={EditIcon} alt="edit_icon"/>
                                                </IconButton>
                                            </TooltipMessage>
                                        </Link>
                                        <DeleteComponent
                                            id={id}
                                            text={`Do you really want to terminate the contract with «${name}»?`}
                                            tooltip="Delete client"
                                            onDelete={deleteClient}
                                            onRemove={()=>{this.doRequest(activePage)}}
                                            icon={DeleteIcon}
                                            type='icon'
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        :
                        empty ?
                            <div className="table_body">
                                <div className="table_row">
                                    <p className="table_no_items">No items</p>
                                </div>
                            </div>
                            :
                            null
                    }
                    {clients_list.count && clients_list.count > 10 ?
                        <Pagination
                            current={activePage}
                            pageCount={10}
                            total={clients_list.count}
                            onChange={this.changePage}
                        />
                        :
                        null
                    }
                </div>
            </div>
        );
    }
}

Clients.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

function mapStateToProps(state) {
    return{
        clients: state.clients
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getClients,
        postInviteClient,
        deleteClient,
        updateClient
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Clients);