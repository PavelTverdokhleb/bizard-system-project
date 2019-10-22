import React from 'react';
import AuthButton from '../../components/Buttons/AuthButton/AuthButton';
import Logo_light_Icon from '../../../assets/img/logo_light.png';

import "./NoMatch.scss";

const NoMatch = ({ location }) => (
    <div className="no_match">
        <div className="background_no_mach">
            <div className="content_no_match">
                <div className="logo_icon">
                    <img src={Logo_light_Icon}/>
                </div>
                <span>The page you’re looking for doesn’t exist</span>
                <p className="no_match_wrapper">
                    404
                </p>
                <p>Page not found</p>
                <AuthButton
                    link
                >
                    BACK TO HOME
                </AuthButton>
            </div>
        </div>
    </div>
);

export default NoMatch;