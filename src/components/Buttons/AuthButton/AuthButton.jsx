import React from 'react';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import './AuthButton.scss';

const AuthButton = (props) => {
    return (
        <div className="auth_btn_wrapper">
            {props.link ?
                <Link to="/">
                    <Button variant="contained" classes={{root: 'auth_btn'}} fullWidth disabled={props.disabled}>
                        {props.children}
                    </Button>
                </Link>
                :
                <Button type='submit' variant="contained" classes={{root: 'auth_btn'}} fullWidth disabled={props.disabled}>
                    {props.children}
                </Button>
            }
        </div>
    );
};

export default AuthButton;