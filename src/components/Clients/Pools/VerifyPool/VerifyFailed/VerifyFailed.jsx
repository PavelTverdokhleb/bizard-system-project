import React from 'react';
import ActionButton from '../../../../Buttons/ActionButton/ActionButton';
import AttentionImg from '../../../../../../assets/img/attention-icon.png';
import './VerifyFailed.scss';

const VerifyFailed = ({pool, data, algorithm, close}) => (
    <div className="verify-failed">
        <div className="box-icon">
            <img src={AttentionImg}/>
        </div>
        <div className="notice">Notice: Pool verificator may not be 100% accurate and may report pool being compatible while in fact it is not compatible or vice versa. Always discuss with pool operator if you encounter any issues with the pool verificator.</div>
        <div className="pool-info">
            <span>Pool host: {pool.pool}</span>
            <span>Pool port: {pool.port}</span>
            <span>Pool user: {pool.username}</span>
            <span>Pool pass: {pool.password}</span>
            <span>Algorithm: {algorithm}</span>
        </div>
        <div className="wrapper-info">
            <div>Resolving pool host {pool.pool}...</div>
            {data && data.length ?
                data.map((e,i)=>(
                    <span key={i} className={e.result != "OK" ? "text-red" : ''}>{e.result}: {e.text}</span>
                ))
                : null
            }
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

export default (VerifyFailed);