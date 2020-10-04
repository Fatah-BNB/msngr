import React, {Component} from 'react'
import {HashRouter as Router, Switch, Redirect, Route} from 'react-router-dom'

import Home from './pages/Home/Home'
import Chat from './pages/Chat/Chat'
import Profile from './pages/Profile/Profile'
import Signup from './pages/SignUp/Signup'
import Login from './pages/Login/Login'

import firebase from './Services/firebase'
import {toast, ToastContainer} from 'react-toastify'

import './App.css'

class App extends Component{

  showToast = (type, message) =>{
    switch(type){
      case 0: toast.warning(message)
      break
      case 1: toast.success(message)
      break
      default: break
    }
  }

  constructor(){
    super()
    this.state={
      authenticated: false,
      loading: true,
    }
  }


  componentDidMount(){
    firebase.auth().onAuthStateChanged(user =>{
      if(user){
        this.setState=({
          authenticated: true,
          loading: false
        })
      }
      else{
        this.setState=({
          authenticated: false,
          loading: false
        })
      }
    })
  }

  render(){
    return(
      this.state.loading === !true ?(
        <div className="spinnerBorder textSuccess" role="status">
          <span className="srOnly">Loading ...</span>
        </div>
      ) : (
        <Router>
          <ToastContainer autoClose={3000} hideProgressBar={true} position={toast.POSITION.TOP_CENTER}/>
          <Switch>
            <Route exact path= "/" render= {props => <Home{...props}/>}/>
            <Route path="/login" render={props => <Login showToast={this.showToast}{...props}/>}/>
            <Route path="/profile" render={props => <Profile showToast={this.showToast}{...props}/>}/>
            <Route path="/signup" render={props => <Signup showToast={this.showToast}{...props}/>}/>
            <Route path="/chat" render={props => <Chat showToast={this.showToast}{...props}/>}/>
          </Switch>
        </Router>
      )
    )
  }


}

export default App

