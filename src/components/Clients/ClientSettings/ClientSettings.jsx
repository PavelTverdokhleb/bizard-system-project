import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {client_items} from "../../../helpers/navigation-items";
import Navigation from '../../Navigation/Navigation';
import BreadCrumbs from '../../BreadCrumbs/BreadCrumbs';
import EditClientForm from '../EditClient/EditClientForm/EditClientForm';
import {getOptionForClient} from "../../../helpers/functions";

class CientSettings extends Component {
    constructor(props) {
        super(props);
        const { match } = this.props;
        let pathArr = match.url.split('/');
        this.prevPath  = pathArr.slice(0, pathArr.length - 1).join('/');
    }

    render() {
        const {history, clients:{client_detail}, clients:{client_detail:{name, id, status}}} = this.props;
        let breadItems = [
            {url: '/admin/clients', name: 'Clients' },
            {url: null, name: name }
        ];
        return (
            <div className="client_settings_page">
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
                    <EditClientForm
                        id={client_detail.id}
                        history={history}
                        client={client_detail}
                    />
                </div>
            </div>
        );
    }
}

CientSettings.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

function mapStateToProps(state) {
    return{
        clients: state.clients
    }
}

export default connect(mapStateToProps, null)(CientSettings);