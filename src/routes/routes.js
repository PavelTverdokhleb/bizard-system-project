import React from 'react';
import App from '../containers/App';
import {
    Route,
    Switch,
    Redirect
} from 'react-router-dom';
import Container from '../containers/Container/Container';
import Authentication from '../containers/Authentication/Authentication';
import AdminAuth from '../components/Authentication/AdminAuth/AdminAuth';
import ContactUs from '../components/ContactUs/ContactUs';
import NoMatch from '../containers/NoMatch/NoMatch';

export default (
    <App>
        <Switch>
            <Route path='/' exact render={() => <Redirect to="/admin" push />}/>
            <Route path='/admin' component={Container} />
            <Route path='/authentication' component={Authentication} />
            <Route path='/auth-admin' component={AdminAuth} />
            <Route path='/contacts' component={ContactUs} />
            <Route component={NoMatch}/>
        </Switch>
    </App>
)
