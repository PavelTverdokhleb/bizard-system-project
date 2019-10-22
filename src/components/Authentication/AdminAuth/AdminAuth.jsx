import React, {Component} from 'react';
import PropTypes from 'prop-types';

class AdminAuth extends Component {

    componentWillMount(){
        const {location, history} = this.props;
        let url = new URLSearchParams(location.search.substring(1));
        let tok = url.get("token");
        if(tok) {
            localStorage.token = tok;
        }
        setTimeout(()=>{
            history.push('/');
        }, 0);

    }

    render(){
        return null
    }
}

AdminAuth.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

export default (AdminAuth);