import React from 'react';
import Button from '@material-ui/core/Button';
import './TableButton.scss';

const TableButton = (props) => {
    return (
        <div className={`table_button table_button_${props.class}`}>
            <Button
                variant="outlined"
                disabled={props.disabled ? props.disabled : null}
                onClick={props.action ? props.action : null}
            >
                {props.text}
            </Button>
        </div>
    );
};

export default TableButton;