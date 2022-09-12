import React from 'react'
import Button from './Button'


const NavCollapse = ({isLogged}) => {
    return (
        <div className="col flex-column collapse navbar-collapse" id="navbarSupportedContent">
          <nav className=" nolonoloBackgroundNavSecond nolonoloFullWidth navTabContainer">
            <div className="nav nav-tabs justify-content-center pt-2 m-0 nolonoloBackgroundNavSecond nolonoloFullWidth flex-column"
              id="nav-tab" role="tablist">
                <button className="nolonoloYellowText nav-link active" id="nav-store-tab" data-bs-toggle="tab"
                  data-bs-target="#nav-store" type="button" role="tab" aria-controls="nav-store"
                  aria-selected="true">Store</button>
                {isLogged ? (<button className="nolonoloYellowText nav-link" id="nav-rentals-tab" data-bs-toggle="tab"
                data-bs-target="#nav-rentals" type="button" role="tab" aria-controls="nav-rentals"
                aria-selected="false">My Rentals</button>):(<button className="nolonoloYellowText nav-link disabled" id="nav-rentals-tab" data-bs-toggle="tab"
                data-bs-target="#nav-rentals" type="button" role="tab" aria-controls="nav-rentals"
                aria-selected="false">My Rentals</button>)}
                {isLogged ? (<button className="nolonoloYellowText nav-link" id="nav-profile-tab" data-bs-toggle="tab"
                data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile"
                aria-selected="false">Profile</button>) : (<button className="nolonoloYellowText nav-link disabled" id="nav-profile-tab" data-bs-toggle="tab"
                data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile"
                aria-selected="false">Profile</button>)}
                {!isLogged && <button className="nolonoloYellowText nav-link" id="nav-login-tab" data-bs-toggle="tab"
                data-bs-target="#nav-login" type="button" role="tab" aria-controls="nav-login"
                aria-selected="false">Login or register</button>}
              
            </div>
          </nav>
          <div className="nolonoloBackgroundNavSecond container-fluid justify-content-center searchBarContainer">
            <form className="d-flex mb-2 mt-2 nolonoloFullWidth">
              <input id="searchInput" className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
              <Button btnId="searchBtn" className="btn nolonoloWhiteText nolonoloYellowBackground" text="Search"/>
            </form>
          </div>
        </div>
    )
}

export default NavCollapse
