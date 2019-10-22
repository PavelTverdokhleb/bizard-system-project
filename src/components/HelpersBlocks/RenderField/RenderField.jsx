import React from 'react';
import './RenderField.scss';

const renderField = ({ input, placeholder, classes, type, id, label, autoFocus, preLabel, symbol, disabled, meta: {touched, error} }) => (
    <label className={touched && error ? `error_field custom_input ${classes}` : input.value !== '' ? `custom_input active_input ${classes}` : `custom_input ${classes}`}>
        {preLabel ? <div className="pool_pre_label">{preLabel}</div> : null}
        <input {...input} placeholder={placeholder} id={id} type={type} autoComplete='off' autoFocus={autoFocus} disabled={disabled} />
        {touched && error ? <div className="error_container"><img src="../../../../assets/img/error_icon.png" alt="icon"/></div> : null}
        {touched && error ? <span className="error_message">{error}</span> : null}
        {label ? <span className={input.value !== '' || preLabel ? "floating_label floating_label_active" : "floating_label"}>{label}</span> : null}
        {symbol ? <span className="field_symbol">{symbol}</span> : null}
    </label>
);

export default renderField;