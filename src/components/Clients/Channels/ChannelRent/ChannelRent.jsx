import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {channel_items_monitoring, channel_items_finances} from "../../../../helpers/navigation-items";
import BreadCrumbs from '../../../BreadCrumbs/BreadCrumbs';
import Navigation from '../../../Navigation/Navigation';
import Loader from "../../../Loader/Loader";
import RentDisabled from './RentDisabled/RentDisabled';
import RentAllowed from './RentAllowed/RentAllowed';

import {getRent} from "../../../../actions/channelsActions";

import './ChannelRent.scss';

class ChannelRent extends Component {
    constructor(props) {
        super(props);
        const { match } = this.props;
        let pathArr = match.url.split('/');
        this.prevPath  = pathArr.slice(0, pathArr.length - 1).join('/');
        this.state = {
            loadingRent: true
        };
    }

    componentDidMount(){
        const {getRent, channels:{channel_detail:{id}}, clients:{client_detail}} = this.props;
        let arr = [client_detail.id, id];
        getRent(arr).then(res=>{
            if(res.payload && res.payload.status && res.payload.status === 200){
                this.setState({loadingRent: false});
            }
        });
    }

    render(){
        const {channels:{channel_detail:{name}, rent}, clients:{client_detail}} = this.props;
        const {loadingRent} = this.state;
        let breadItems = [
            {url: '/admin/clients', name: 'Clients' },
            {url: `/admin/clients/${client_detail.id}/inner/channels`, name: client_detail.name },
            {url: null, name: name }
        ];
        let showAutoSwitch = client_detail.mode !== 'FM';
        return (
            <div className="rent_page">
                <BreadCrumbs items={breadItems}/>
                <div className="page_header">
                    <h2>{name}</h2>
                </div>
                <div className="page_content_wrapper">
                    <Navigation
                        path={this.prevPath}
                        items={showAutoSwitch ? channel_items_monitoring : channel_items_finances}
                    />
                    <div className="info_page_wrapper">
                        {loadingRent ?
                            <Loader class="page_client_inner "/>
                            :
                            rent.allowed ?
                                <RentAllowed
                                    rent={rent}
                                />
                                :
                                <RentDisabled/>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

ChannelRent.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

function mapStateToProps(state) {
    return{
        channels: state.channels,
        clients: state.clients
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getRent
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelRent);