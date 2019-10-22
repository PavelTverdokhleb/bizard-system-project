import React from 'react';

import DisabledIcon from '../../../../../../assets/img/disabled_icon.png';

import './RentDisabled.scss';

const RentDisabled = (props) => {
    return (
        <div className="disabled_rent_wrapper">
            <img src={DisabledIcon} alt="disabled"/>
            <p>‘Rent’ mode for this channel’s algorithm is not available</p>
        </div>
    );
};

export default RentDisabled;