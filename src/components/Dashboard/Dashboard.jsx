import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

class Dashboard extends Component {
    render(){
        return (
            <div className="dashboard_page">
                <div className="page_header">
                    <h2>Dashboard</h2>
                </div>
            </div>
        );
    }
}

Dashboard.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

function mapStateToProps(state) {
    return{
        //name: state.name
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        //login
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);