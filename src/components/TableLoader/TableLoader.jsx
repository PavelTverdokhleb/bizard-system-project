import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import './TableLoader.scss';

const TableLoader = (props) => {
    return (
        <div className="table_loader">
            <LinearProgress />
        </div>
    );
};

export default TableLoader;