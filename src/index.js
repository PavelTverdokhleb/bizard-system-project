import React from 'react';
import { render } from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux'
import { multiClientMiddleware } from 'redux-axios-middleware';
import api from "./actions/api";
import rootReducer from "./reducers/index";
import routes from './routes/routes';

const axiosMiddlewareOptions = {
    interceptors: {
        request: [
            (action, config) => {
                if (localStorage.token) {
                    config.headers['Authorization'] = 'Token ' + localStorage.token;
                }
                return config
            }
        ]
    }
};
const history = createBrowserHistory();
const appRouterMiddleware = routerMiddleware(history);
const createStoreWithMiddleware = applyMiddleware(multiClientMiddleware(api, axiosMiddlewareOptions), appRouterMiddleware)(createStore);
const store = createStoreWithMiddleware(rootReducer, {}, window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f);
render(
  <Provider store={store}>
    <ConnectedRouter history={history} children={routes}/>
   </Provider>,
document.querySelector('.wrapper'));
