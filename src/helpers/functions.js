import React from 'react';
import SendInvite from '../components/Clients/SendInvite/SendInvite';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

export function getError(error) {
    let message = [];
    for (let key in error) {
        message.push(error[key]);
    }
    return(
        message.map((el, i)=>{
            return (
                <p key={i}>{el}</p>
            )
        })
    )
}

export function getOptionForClient(status, id, name, size = 'small') {
    switch (status) {
        case 'not invited':
            return (
                <SendInvite
                    id={id}
                    name={name}
                />
            );
        case 'accepted':
            return (
                <span className={`table_icon_wrapper icon_active icon_${size}`}>
                        <FiberManualRecordIcon />
                        <p>Active</p>
                    </span>
            );
        case 'invited':
            return (
                <span className={`table_icon_wrapper icon_invited icon_${size}`}>
                        <FiberManualRecordIcon />
                        <p>Invited</p>
                    </span>
            );
        case 'rejected':
            return (
                <span className={`table_icon_wrapper icon_rejected icon_${size}`}>
                        <FiberManualRecordIcon />
                        <p>Rejected</p>
                    </span>
            );
        default:
            return (
                <span>Unrecognized status</span>
            );
    }
}

export function convertMinutes(minutes) {
    return `(${Math.floor(minutes/24/60)}d ${Math.floor(minutes/60%24)}h ${Math.floor(minutes%60)}m)`;
}