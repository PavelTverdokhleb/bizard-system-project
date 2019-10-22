import React from 'react';
import {NavLink} from 'react-router-dom';

const Navigation = ({path, items}) => {
    return (
        <div className="navigation_client_info">
            {items.map(({url, title, activeClass}, i)=>(
                <NavLink to={`${path}${url}`} key={i} activeClassName={activeClass}>{title}</NavLink>
            ))}
        </div>
    );
};

export default Navigation;