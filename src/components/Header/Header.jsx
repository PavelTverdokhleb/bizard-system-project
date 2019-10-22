import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from "prop-types";
import Logo from '../Logo/Logo';
import IconButton from '@material-ui/core/IconButton';
import BalanceTopUp from './BalanceTopUp/BalanceTopUp';

import LogOutIcon from '../../../assets/img/logout_icon.png';

import './Header.scss';

class Header extends Component {

    logOut = () => {
        localStorage.clear();
        this.props.user.user_info = {};
        this.props.user.user_fetched = null;
        this.props.history.push('/');
    };

    convertNumber = (x) => {
        let parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    };

    render(){
        const {user:{user_info}} = this.props;
        return (
            <header className='header_wrapper'>
                <Logo header />
                {user_info && user_info.email ?
                    <div className="header_user_wrapper">
                        <div className="balance-block">
                            <p>Balance: ${this.convertNumber(user_info.balance)}</p>
                            <BalanceTopUp
                                user={user_info}
                            />
                        </div>
                        <p>{user_info.email}</p>
                        <IconButton onClick={this.logOut}>
                            <img src={LogOutIcon} alt="menu_icon"/>
                        </IconButton>
                    </div>
                    :
                    null
                }
            </header>
        );
    }
}


Header.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

function mapStateToProps(state) {
    return{
        user: state.user,
    }
}

export default connect(mapStateToProps, null)(Header);

