import React, { Component } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import './home.css'
import Images from '../../ProjectImages/PI'
import { Link } from 'react-router-dom'



export default class HomePage extends Component{
    render(){
        return(
            <div>
                <Header/>
                <div className="splashContainer">
                    <div className="splash">
                        <h1 className="splashHead">MSNGR</h1>
                        <p className="splashSubhead">Special place for special freinds</p>
                        <div id="btnWrapper">
                            <Link to="/login">
                                <a className="btn" href="#">
                                    <div className="dotsContainer">
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                    </div>
                                    <span className="btnText">Get Started</span>
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="content-wrapper">
                    <div className="content">
                        <h2 className="content-head isCenter">Features of our MSNGR</h2>
                        <div className="Appfeatures">
                            <div className="content-head">
                                <h3 className="content-subhead">
                                    <i className="fa fa-rocket"></i>
                                    Get started quickly
                                </h3>
                                <p>
                                    Just register with us and start chating with friends
                                </p>
                            </div>
                            <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
                            <div className="content-head">
                                <h3 className="content-subhead">
                                        <i className="fa fa-sign-in"></i>
                                        Firebase authentication
                                    </h3>
                                    <p>
                                        Firebase authentication is implemented in this app
                                    </p>
                            </div></div>
                            <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
                            <div className="content-head">
                                <h3 className="content-subhead">
                                        <i className="fa fa-th-large"></i>
                                        Medias
                                    </h3>
                                    <p>
                                        Share medias with your friends
                                    </p>
                            </div></div>
                            <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
                            <div className="content-head">
                                <h3 className="content-subhead">
                                        <i className="fa fa-refresh"></i>
                                        Update
                                    </h3>
                                    <p>
                                        more & more features are coming soon
                                    </p>
                            </div></div>
                        </div>
                    </div>
                    <div className="AppfeaturesFounder">
                        <div className="l-box-lrg isCenter pure-u-1 pure-u-md-1-2 pure-u-lg-2-5">
                            <img width="300" alt="file icons" className="pure-img-responsive" src={Images.angel} />
                        </div>
                        <div className="pure-u-1 pure-u-md-1-2 pure-u-lg-3-5">
                            <h2 className="content-head content-head-ribbon">Perfect ANGEL</h2>
                            <p style={{color:"white"}}>The Founder of MSNGR</p>
                            <p style={{color:"white"}}>A front-end web developer, computer science student, android developer</p>
                        </div>
                    </div>
                    <div className="content">
                        <h2 className="content-head isCenter">MESSANGER => MSNGR</h2>
                        <div className="Appfeatures">
                            <div className="l-box-lrgpure-u-1 pure-u-md-2-5">
                                <form className="pure-form pure-form-stacked">
                                    <p style={{color:'red', marginLeft:'10px'}}>this form is not at service for the moment !</p>
                                    <fieldset>
                                        <label for="name">Your Name</label>
                                        <input id="name" type="text" placeholder="Username" />

                                        <label for="email">Your Email</label>
                                        <input id="email" type="text" placeholder="email address" />

                                        <label for="password">Your Password</label>
                                        <input id="password" type="text" placeholder="Password" />

                                        <button type="submit" className="pure-button">Sign Up</button>
                                    </fieldset>
                                </form>
                            </div>
                            <div id="contact" className="l-box-lrg pure-u-1 pure-u-md-3-5">
                                <h4>Contact Us</h4>
                                <p>
                                    If you have any questions you can directly contact me on social media:
                                </p>
                                <p>Twitter : <a href="https://twitter.com/Perfect0_0ANGEL">@Perfect0_0ANGEL</a></p>
                                <p>Facebook : <a href="https://www.facebook.com/perfect.aangel">Perfect Angel</a></p>
                                <p>Instagram : <a href="https://www.instagram.com/perfectt_angel/?hl=en">perfectt_angel</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


