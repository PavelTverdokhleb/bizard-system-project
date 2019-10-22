import React from 'react';
import EditClientForm from './EditClientForm/EditClientForm';
import './EditClient.scss';

const EditClient = ({match, history}) => {
    return (
        <div className="edit_clients_page">
            <EditClientForm
                id={match.params.id}
                history={history}
            />
        </div>
    );
};

export default (EditClient);