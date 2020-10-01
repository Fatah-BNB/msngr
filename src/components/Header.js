import React from 'react'
import {Link} from 'react-router-dom'
import './header.css'

function Header (){
    return(
        <header className="headerLoginSignup">
            <div className="headerLimiter">
                <h1><a href="/">MSNGR</a></h1>
                <nav>
                    <Link to="/">HOME</Link>
                    <a className="selected" href="/"><Link to="/">About MSNGR</Link></a>
                    <a href="/"><Link to="/">Contact Us</Link></a>
                </nav>
                <ul>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/signup">Sign Up</Link></li>
                </ul>
            </div>
        </header>
    )
}


export default Header