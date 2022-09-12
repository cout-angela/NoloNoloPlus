import React, { useState, useEffect } from "react";
import Navbar from './components/Navbar'
import Store from './components/Store'
import Rentals from './components/Rentals'
import Profile from './components/Profile'
import LoginOrRegister from "./components/LoginOrRegister";

import {handle} from './errHandler';


const App = () => {

  
  const [isLogged, setisLogged ] = useState(false);
  const [customer, setCustomer] = useState({});

  useEffect(() => {
    const checkLogin = async () => {
      const res = await fetch ('/api/customer/isLogged');
      const data = await res.json()
      var answer = handle(data);
      if (answer) {
        if (answer.command === 'displayErr') { return alert(answer.msg) }
        if (answer !== 'notLogged') {
          setisLogged(true);
          setCustomer(answer);
        }
      }
    }
    checkLogin();
  }, [])
 const updateCustomer = (newCustomer) => {
    setCustomer(newCustomer);
  }
  return (
      <div className='container-fluid p-0 nolonoloFullWidth'>
        <Navbar isLogged={isLogged}/>
        <div id="pageContent" className="container-fluid nolonoloFullWidth m-0 p-0">
          <div className="tab-content" id="nav-tabContent">
            <Store isLogged={isLogged}/>
            {isLogged && <Rentals/>} 
            {isLogged && <Profile customer={customer} updateCustomer = {updateCustomer}/>}
            {!isLogged && <LoginOrRegister/>}
          </div>
        </div>
      </div>
  )
}

export default App
