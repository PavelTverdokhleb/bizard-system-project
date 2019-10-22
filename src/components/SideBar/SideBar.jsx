import React from 'react';
import {NavLink} from 'react-router-dom';
import './SideBar.scss';

const SideBar = (props) => {
    return (
        <aside className="sidebar_container">
            {/*<NavLink*/}
                {/*to={`${props.url}/dashboard`}*/}
                {/*exact*/}
                {/*activeClassName="active_item_menu"*/}
            {/*>*/}
                {/*Dashboard*/}
            {/*</NavLink>*/}
            <NavLink
                to={`${props.url}/clients`}
                activeClassName="active_item_menu"
            >
                Clients
            </NavLink>
            <NavLink
                to={`${props.url}/financial-statistics`}
                activeClassName="active_item_menu"
            >
                Financial Statistics
            </NavLink>
            <NavLink
                to={`${props.url}/settings`}
                activeClassName="active_item_menu"
            >
                Settings
            </NavLink>
        </aside>
    );
};

export default SideBar;