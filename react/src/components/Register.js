import React, { useState } from "react";
import {handle} from './../errHandler';
import Toast from 'react-bootstrap/Toast';

const Register = () => {
    const [show, setShow] = useState(false);
    const [form, setForm] = useState({
        avatar: "",
        username: "",
        name: "",
        surname: "",
        password: ""
      });

      // These methods will update the state properties.
      function updateForm(value) {
        return setForm((prev) => {
          return { ...prev, ...value };
        });
      }
      // This function will handle the submission.
      async function onSubmit(e) {
        e.preventDefault();
      
        // When a post request is sent to the create url, we'll add a new record to the database.
        const newCustomer = { ...form };
        
        await fetch('/api/customer/reg', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCustomer),
        })
        .then(response => {
          response.json();
        })
        /*.then(data => {
          console.log('Success:', data);
          
        })*/
        .catch((error) => {
          handle(error);
        });
        setShow(true);
        setForm({ avatar: "", username: "", name: "", surname: "", password: "" });
        
      }
      // This following section will display the form that takes the input from the user.
      return (
          <>
          <Toast show={show} onClose={() => setShow(false)} autohide>
                  <Toast.Header>
                    <strong className="me-auto">NolonoloPlus</strong>
                  </Toast.Header>
                <Toast.Body>You are now registered. Please log in</Toast.Body>
              </Toast>
                <div className="row nolonoloFullWidth ">

                    <div className="col d-flex justify-content-center border-end border-2">
                        <div className="row nolonoloFullWidth mb-5 mt-3">
                            <div className="col-12 d-flex justify-content-center">
                                <h2>Register</h2>
                            </div>
                            <div className="col-12 d-flex justify-content-center">
                                <form id="regForm" onSubmit={onSubmit}>
                                    <div>
                                        <label className="form-label" htmlFor="username">Choose a username</label>
                                        <input 
                                            className="form-control" 
                                            type="text" 
                                            id="username" 
                                            name="username" 
                                            value={form.username}  
                                            onChange={(e) => updateForm({ username: e.target.value })}
                                            required 
                                            />
                                    </div>
                                    <div>
                                        <label className="form-label" htmlFor="name">Your name</label>
                                        <input 
                                            className="form-control" 
                                            type="text" 
                                            id="name" 
                                            name="name"
                                            value={form.name}  
                                            onChange={(e) => updateForm({ name: e.target.value })} 
                                            required 
                                            />
                                    </div>
                                    <div>
                                        <label className="form-label" htmlFor="surname">Your surname</label>
                                        <input 
                                            className="form-control" 
                                            type="text" 
                                            id="surname" 
                                            name="surname"
                                            value={form.surname}  
                                            onChange={(e) => updateForm({ surname: e.target.value })}
                                            required 
                                            />
                                    </div>
                                    <div>
                                        <label className="form-label" htmlFor="password">Password</label>
                                        <input 
                                            className="form-control" 
                                            type="password" 
                                            id="password" 
                                            name="password"
                                            value={form.password}  
                                            onChange={(e) => updateForm({ password: e.target.value })}
                                            required 
                                            />
                                    </div>
                                    <div className="mt-2">
                                        <button className="btn btn-warning" type="submit">Register</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                
          </>
      );
     }

export default Register