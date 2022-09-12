
import Button from './Button'
import logo from '../logo.png'
import NavCollapse from './NavCollapse'

const Navbar = ({isLogged}) => {

  return (
    //NAVBAR
    <nav className="navbar navbar-expand-lg sticky-top navbar-dark nolonoloFullWidth nolonoloBackgroundNavSecond p-2">
      <div className="col-1">
        <a className="navbar-brand nolonoloNavLogo" href="#">
          <img src={logo} alt="nolonoloplus logo" className="p-0" />
        </a>
      </div>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <NavCollapse isLogged = {isLogged}/>
        

    </nav>
  )
}

// CSS in JS
// const headingStyle = {
//   color: 'red',
//   backgroundColor: 'black',
// }

export default Navbar
