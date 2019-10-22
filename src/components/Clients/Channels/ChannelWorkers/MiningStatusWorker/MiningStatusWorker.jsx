import React from 'react';

import InfoIcon from '../../../../../../assets/img/info.png';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const MiningStatusWorker = ({active, temperature, showTooltip}) => {
    let hasTemp = typeof temperature !== 'undefined' && temperature.length > 0;
    return (
        <div>
            {active ?
                <div>
                    <p className="cell_centered gray_text worker_status_active">
                        <FiberManualRecordIcon fontSize="default"/>
                        Mining
                    </p>
                    {hasTemp ?
                        <p className="gray_text status_mining">
                            t: {temperature.join(' - ')} °С
                            {showTooltip && temperature.length > 1 ?
                                <span className="info_tooltip">
                                    <img src={InfoIcon} alt="tooltip icon"/>
                                    <span className="tooltip">
                                        To see the temperature info for <br/>
                                        each miner of this worker, please <br/>
                                        visit the worker's page
                                    </span>
                                </span>
                                :
                                null
                            }
                        </p>
                        :
                        null
                    }
                </div>
                :
                <p className="gray_text status_mining worker_status_inactive">
                    <FiberManualRecordIcon fontSize="default"/>
                    Stopped
                </p>
            }
        </div>
    );
}

export default MiningStatusWorker;