import React from 'react';
import RadioGroup from '@material-ui/core/RadioGroup';

import './RenderRadio.scss';

const renderRadio = ({ input, label, children, checked, classes, disable, meta: {touched, error}}) => (
    <div className={touched && error ? `error_field_radio render_radio_wrapper ${classes}` : `render_radio_wrapper ${classes}`}>
        <RadioGroup
            {...input}
        >
            {children}
        </RadioGroup>
    </div>
);

export default renderRadio;