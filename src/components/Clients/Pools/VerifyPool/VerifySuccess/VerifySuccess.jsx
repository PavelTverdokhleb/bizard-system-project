import React from 'react';
import ActionButton from '../../../../Buttons/ActionButton/ActionButton';
import './VerifySuccess.scss';

const VerifySuccess = ({pool, data, algorithm, close}) => (
    <div className="verify-success">
        <div className="notice">Notice: Pool verificator may not be 100% accurate and may report pool being compatible while in fact it is not compatible or vice versa. Always discuss with pool operator if you encounter any issues with the pool verificator.</div>
        <div className="pool-info">
            <span>Pool host: {pool.pool}</span>
            <span>Pool port: {pool.port}</span>
            <span>Pool user: {pool.username}</span>
            <span>Pool pass: {pool.password}</span>
            <span>Algorithm: {algorithm}</span>
        </div>
        <div className="pool-info">
            {data && data.length ?
                data.map((e,i)=>(
                    <span key={i}>{e.text}<i className={e.result === "OK" ? "green-text" : null}>{e.result}</i></span>
                ))
                : null
            }
        </div>
        <div className="block-green">
            <span>Pool verification process is complete. <b>Tested pool is compatible!</b> </span>
        </div>
        <div className="dialog_block_button">
            <ActionButton
                text="Close"
                class="cancel"
                type="button"
                action={close}
            />
        </div>
    </div>
);

export default (VerifySuccess);