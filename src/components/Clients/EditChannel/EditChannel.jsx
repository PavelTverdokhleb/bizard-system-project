import React from 'react';
import EditChannelForm from './EditChannelForm/EditChannelForm';

const EditChannel = ({match, history}) => (
    <div className="edit_clients_page">
        <EditChannelForm
            channel={match.params.channel}
            history={history}
            match={match}
        />
    </div>
);

export default (EditChannel);