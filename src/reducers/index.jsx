import { combineReducers } from "redux";
import UserReducer from './reducerUser';
import AuthenticationReducer from './reducerAuthentication';
import ClientsReducer from './reducerClients';
import ChannelsReducer from './reducerChannels';
import PoolsReducer from './reducerPools';
import WorkersReducer from './reducerWorkers';
import FinancesReducer from './reducerFinances';
import {reducer as formReducer} from 'redux-form';

import { routerReducer } from 'react-router-redux';

const rootReducer = combineReducers({
    router: routerReducer,
    form: formReducer,
    user: UserReducer,
    auth: AuthenticationReducer,
    clients: ClientsReducer,
    channels: ChannelsReducer,
    pools: PoolsReducer,
    workers: WorkersReducer,
    finances: FinancesReducer
});

export default rootReducer;
