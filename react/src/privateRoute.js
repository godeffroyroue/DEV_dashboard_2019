import React from "react"
import {Redirect, Route} from "react-router-dom"

export const PrivateRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={(props) => (
        localStorage.getItem('auth')
            ?
            (<Component {...props} />)
            :
            (<Redirect to={{pathname: "/", state: {from: props.location}}}/>)
    )}/>
);

// dont forget to use "localStorage.setItem('authToken','foo')"