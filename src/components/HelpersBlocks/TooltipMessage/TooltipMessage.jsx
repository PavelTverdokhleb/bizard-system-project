import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import './TooltipMessage.scss';

const TooltipMessage = ({text, children, error = false, delay = 1000, position = 'top'}) => {
    return (
        <Tooltip
            title={text}
            placement={position}
            enterDelay={error ? 300 : delay}
            leaveDelay={200}
            disableTouchListener={true}
            disableFocusListener={true}
            classes={{
                tooltip: error ? "error_message_tooltip" : "message_tooltip",
                popper: "message_popper"
            }}
        >
            {children}
        </Tooltip>
    );
};

export default TooltipMessage;
