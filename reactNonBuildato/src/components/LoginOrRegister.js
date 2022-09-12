import React, { useState } from 'react'
import Login from './Login'
import Register from './Register'

const LoginOrRegister = () => {

    return (
        <div className="tab-pane fade" id="nav-login" role="tabpanel" aria-labelledby="nav-login-tab">
            <Register />
            <Login />
        </div>
    )
}

export default LoginOrRegister
