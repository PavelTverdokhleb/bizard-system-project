import React from 'react';
import Select from '@material-ui/core/Select';
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import './SelectComponent.scss';

const SelectComponent = (props) => {
    return (
        <div className="select_component_wrapper">
            <Select
                value={props.value}
                onChange={props.onChange}
                IconComponent={KeyboardArrowDownIcon}
                displayEmpty
                MenuProps={{
                    classes: {
                        paper: 'select_component_paper'
                    }
                }}
            >
                {props.children}
            </Select>
            {props.label ?
                <span className={props.value !== '' ? "select_component_label hidden_label" : "select_component_label"}>{props.label}</span>
                :
                null
            }
        </div>

    );
};

export default SelectComponent;