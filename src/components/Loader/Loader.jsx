import React from 'react';
import './Loader.scss';

const Loader = (props) => {
    return (
        <div className={`cssload-wrapper-${props.class}`}>
            <div className={`cssload-loader-${props.class}`}>
                <div className="cssload-inner cssload-one"></div>
                <div className="cssload-inner cssload-two"></div>
                <div className="cssload-inner cssload-three"></div>
            </div>
        </div>
    );
};

export default Loader;