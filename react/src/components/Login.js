import React, { useState } from "react";
import { useNavigate } from "react-router";

import {handle} from './../errHandler';

const Login = () => {
    const [form, setForm] = useState({
        username: "",
        password: ""
      });
      const navigate = useNavigate();
      function updateForm(value) {
        return setForm((prev) => {
          return { ...prev, ...value };
        });
      }
      async function onSubmit(e) {
      e.preventDefault();
        // When a post request is sent to the create url, we'll add a new record to the database.
        const customer = { ...form };
        await fetch('/api/customer/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(customer),
        })
        .then(response => {
          console.log('\n\n\t\tRESPONSE\n\n')
          console.log(response.json());
        })
        .catch((error) => {
          handle(error);
        });

        setForm({username: "", password: "" });
        
        window.location.reload(false);
        
      }
      
    return (
        <div className="col d-flex justify-content-center">
            <div className="row nolonoloFullWidth mb-5 mt-3">
                <div className="col-12 d-flex justify-content-center">
                    <h2>Login</h2>
                </div>
                <div className="col-12 d-flex justify-content-center">
                    <form id="logForm" onSubmit={onSubmit}>
                        <div>
                            <label className="form-label" htmlFor="logUsername">Username</label>
                            <input 
                                className="form-control" 
                                type="text" 
                                id="logUsername" 
                                name="username"
                                value={form.username}
                                onChange={(e) => updateForm({ username: e.target.value })} 
                                required 
                            />
                        </div>
                        <div>
                            <label className="form-label" htmlFor="logPassword">Password</label>
                            <input 
                                className="form-control" 
                                type="password" 
                                name="password" 
                                id="logPassword"
                                value={form.password}
                                onChange={(e) => updateForm({ password: e.target.value })} 
                                required 
                            />
                        </div>
                        <div className="mt-2">
                            <button className="btn btn-warning" type="submit">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
