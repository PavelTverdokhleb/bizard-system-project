import React from 'react';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import './ActionButton.scss';

const ActionButton = (props) => {
    return (
        <div className={`action_button action_button_${props.class}`}>
            {props.type === 'link' ?
                <Link to={props.href}>
                    <Button variant="contained">
                        {props.text}
                    </Button>
                </Link>
                :
                <Button
                    variant="contained"
                    type={props.formAction ? "submit" : null}
                    disabled={props.disabled ? props.disabled : null}
                    onClick={props.action ? props.action : null}
                    fullWidth={props.full ? props.full : false}
                >
                    {props.text}
                </Button>
            }

        </div>
    );
};

export default ActionButton;