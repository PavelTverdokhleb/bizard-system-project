import React from 'react';
import Switch from '@material-ui/core/Switch';
import './SwitchComponent.scss';

const SwitchedComponent = ({switched, onSwitch, bigSize, disabled = false}) => {
    return (
        <div className={bigSize ? 'switch_component_root big_switch' : 'switch_component_root'}>
            <Switch
                checked={switched}
                onChange={onSwitch}
                value="switch"
                classes={{
                    root: 'switch_root',
                    icon: 'switch_icon',
                    iconChecked: 'switch_icon_checked',
                    switchBase: 'switch_base',
                    checked: 'switch_base_checked',
                    bar: 'switch_bar',
                    disabled: 'switch_disabled'
                }}
                disabled={disabled}
            />
        </div>
    );
};

export default SwitchedComponent;