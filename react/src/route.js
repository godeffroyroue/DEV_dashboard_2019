import React from 'react';
import {Router, Switch, Route} from "react-router-dom";
import history from './history'

import {PrivateRoute} from './privateRoute.js'
import LoginPage from './Auth.js';
import DashboardPage from './dashboardPage.js';

export default class Routes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ""};
        console.log("auth :" + localStorage.getItem('auth'))
    }
    render(){
        return (
        <Router history={history}>
            <Switch>
                <Route exact path="/" component={LoginPage}/>
                <PrivateRoute path="/dashboard" component={DashboardPage}/>
            </Switch>
        </Router>
        );
    }
}