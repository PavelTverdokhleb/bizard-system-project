import React from 'react';
import {Link} from 'react-router-dom';

const Logo = (props) => {
    return (
        <Link to="/">
            <img src={props.header ? "../../../assets/img/logo_light_small.png" : "../../../assets/img/logo_light.png"} alt="logo"/>
        </Link>
    );
};

export default Logo;