import React from 'react';
import Select from '@material-ui/core/Select';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import './RenderSelect.scss';

const renderSelect = ({ input, label, children, classes, disable, meta: {touched, error, warning} }) => (
    <div className={touched && error ? `error_field_select render_select_wrapper ${classes}` : input.value !== '' ? `active_select render_select_wrapper ${classes}` : `render_select_wrapper ${classes}`}>
        <Select
            {...input}
            IconComponent={disable ? ()=>{return null} : KeyboardArrowDownIcon}
            MenuProps={{
                classes: {
                    paper: 'select_paper_root'
                }
            }}
            disabled={disable}
        >
            {children}
        </Select>
        {touched && error ? <p className="error_container"><img src="../../../../assets/img/error_icon.png" alt="icon"/></p> : ''}
        {touched && error ? <span className="error_message">{error}</span>: ''}
        {label ? <span className={input.value !== '' ? "floating_label floating_label_active" : "floating_label"}>{label}</span> : ''}
    </div>


);

export default renderSelect;