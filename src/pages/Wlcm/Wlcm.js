import React, { Component } from 'react'
import './wlcm.css'
import 'react-toastify/dist/ReactToastify.css'


export default class Wlcm extends Component{
    render(){
        return(
            <div className="viewWelcomeBoard">
                <img className="avatarWelcome" src={this.props.currentUserPhoto ? this.props.currentUserPhoto : null} alt="" />
                <span className="textTitleWelcome">{`Weclome ${this.props.currentUserName}`}</span>
                <span className="textDesciptionWelcome">Special place for special friends</span>
            </div>
        )
    }
}