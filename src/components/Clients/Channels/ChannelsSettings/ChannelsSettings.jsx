import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {channel_items_monitoring, channel_items_finances} from "../../../../helpers/navigation-items";
import Navigation from '../../../Navigation/Navigation';
import BreadCrumbs from '../../../BreadCrumbs/BreadCrumbs';
import EditChannelForm from '../../EditChannel/EditChannelForm/EditChannelForm';

class ChannelsSettings extends Component {
    constructor(props) {
        super(props);
        const { match } = this.props;
        let pathArr = match.url.split('/');
        this.prevPath  = pathArr.slice(0, pathArr.length - 1).join('/');
    }

    render() {
        const {history, match, clients:{client_detail}, channels:{channel_detail:{name, id}}} = this.props;
        let breadItems = [
            {url: '/admin/clients', name: 'Clients' },
            {url: `/admin/clients/${client_detail.id}/inner/channels`, name: client_detail.name },
            {url: null, name: name }
        ];
        let showAutoSwitch = client_detail.mode !== 'FM';
        return (
            <div className="client_settings_page">
                <BreadCrumbs items={breadItems}/>
                <div className="page_header">
                    <h2>{name}</h2>
                </div>
                <div className="page_content_wrapper">
                    <Navigation
                        path={this.prevPath}
                        items={showAutoSwitch ? channel_items_monitoring : channel_items_finances}s
                    />
                    <EditChannelForm
                        history={history}
                        match={match}
                    />
                </div>
            </div>
        );
    }
}

ChannelsSettings.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

function mapStateToProps(state) {
    return{
        clients: state.clients,
        channels: state.channels
    }
}

export default connect(mapStateToProps, null)(ChannelsSettings);