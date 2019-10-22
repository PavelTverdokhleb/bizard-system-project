import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import './DialogComponent.scss';

const DialogComponent = (props) => {
    return (
        <Dialog
            open={props.open}
            onClose={props.dialogClose}
            classes={{root: 'default_dialog_root'}}
        >
            {props.children}
        </Dialog>
    );
};

export default DialogComponent;