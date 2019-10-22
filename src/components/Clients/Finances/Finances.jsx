import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import Navigation from '../../Navigation/Navigation';
import BreadCrumbs from '../../BreadCrumbs/BreadCrumbs';
import {client_items} from "../../../helpers/navigation-items";
import {getOptionForClient} from "../../../helpers/functions";

class Finances extends Component {
    constructor(props) {
        super(props);
        const { match } = this.props;
        let pathArr = match.url.split('/');
        this.prevPath  = pathArr.slice(0, pathArr.length - 1).join('/');
    }

    render(){
        const {clients:{client_detail:{name, id, status}}} = this.props;
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
                        Finances
                    </div>
                </div>
            </div>
        );
    }
}

Finances.contextTypes = {
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
        //login
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Finances);