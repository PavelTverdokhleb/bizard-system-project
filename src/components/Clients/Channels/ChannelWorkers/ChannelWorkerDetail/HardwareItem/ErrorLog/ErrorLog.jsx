import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

function renderThumb({ style, ...props }) {
    const thumbStyle = {
        backgroundColor: `#485563`,
        borderRadius: '2px',
        cursor: 'pointer'
    };
    return (
        <div
            style={{ ...style, ...thumbStyle }}
            {...props}
        />
    );
}

function renderTrack({style}) {
    const trackStyle = {
        backgroundColor: `rgba(72, 85, 99, 0.05)`,
        borderRadius: '2px',
        width: '4px',
        right: '2px',
        bottom: '2px',
        top: '2px'
    };
    return (
        <div
            style={{ ...style, ...trackStyle }}
        />
    );
}

const ErrorLog = () => (
    <div className="system-log-info">
        <div className="block-log-info">

            <Scrollbars
                style={{ width: '100%', height: 365 }}
                renderThumbVertical={renderThumb}
                renderTrackVertical={renderTrack}
            >
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.<br/>
                    Amet corporis cumque debitis dignissimos expedita, fugiat<br/>
                    illum incidunt, iste maiores, molestiae nam neque non <br/>
                    nulla obcaecati quam ratione repellat similique voluptatum!<br/>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.<br/>
                    Ab assumenda debitis deserunt earum eius expedita facilis,<br/>
                    ipsam iste nemo, nulla provident quos repellat repudiandae,<br/>
                    sed soluta suscipit voluptatum! Autem, maxime?<br/>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.<br/>
                    Amet corporis cumque debitis dignissimos expedita, fugiat<br/>
                    illum incidunt, iste maiores, molestiae nam neque non <br/>
                    nulla obcaecati quam ratione repellat similique voluptatum!<br/>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.<br/>
                    Ab assumenda debitis deserunt earum eius expedita facilis,<br/>
                    ipsam iste nemo, nulla provident quos repellat repudiandae,<br/>
                    sed soluta suscipit voluptatum! Autem, maxime?<br/>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.<br/>
                    Amet corporis cumque debitis dignissimos expedita, fugiat<br/>
                    illum incidunt, iste maiores, molestiae nam neque non <br/>
                    nulla obcaecati quam ratione repellat similique voluptatum!<br/>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.<br/>
                    Ab assumenda debitis deserunt earum eius expedita facilis,<br/>
                    ipsam iste nemo, nulla provident quos repellat repudiandae,<br/>
                    sed soluta suscipit voluptatum! Autem, maxime?<br/>
                    {/*{get_one_worker_sys_log.length > 0 ?*/}
                    {/*get_one_worker_sys_log.map((elem, i) => {*/}
                    {/*return (*/}
                    {/*<span key={'logs'+i}>{elem}<br/></span>*/}
                    {/*)*/}
                    {/*}) */}
                    {/*:*/}
                    {/*'No logs'*/}
                    {/*}*/}
                </p>
            </Scrollbars>
        </div>
    </div>
);
export default ErrorLog;