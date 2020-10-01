import React, { Component } from 'react'
import LoginStrings from '../Login/LoginStrings'
import firebase from '../../Services/firebase'
import './chat.css'
import ReactLoading from 'react-loading'
import Box from '../Box/Box'
import Wlcm from '../Wlcm/Wlcm'


export default class Chat extends Component{

    constructor(props){
        super(props)
        this.state={
            isLoading: true,
            isOpenDialogConfirmLogout: false,
            currentPeerUser: null,
            displayedContactSwitchedNotification: [],
            displayedContacts: []
        }
        this.currentUserName = localStorage.getItem(LoginStrings.Name)
        this.currentUserId = localStorage.getItem(LoginStrings.ID)
        this.currentUserPhoto = localStorage.getItem(LoginStrings.PhotoURL)
        this.currentUserDocumentId = localStorage.getItem(LoginStrings.FirebaseDocumentId)
        this.currentUserMessages = []
        this.searchUsers = []
        this.notificationMessagesErase = []
        this.displayedContacts = []

        this.goProfile = this.goProfile.bind(this)
        this.getListUser = this.getListUser.bind(this)
        this.renderListUsers = this.renderListUsers.bind(this)
        this.getClassnameforUserandNotification = this.getClassnameforUserandNotification.bind(this)
        this.notificationErase = this.notificationErase.bind(this)
        this.updaterenderList = this.updaterenderList.bind(this)
    }


    logout = () =>{
        firebase.auth().signOut()
        this.props.history.push("/")
        localStorage.clear()
    }

    goProfile = () =>{
        this.props.history.push("/profile")
    }

    componentDidMount(){
        firebase.firestore().collection("users").doc(this.currentUserDocumentId).get()
        .then((doc) =>{
            doc.data().messages.map (i =>{
                this.currentUserMessages.push({
                    notificationId: i.notificationId,
                    number: i.number
                })
            })
            this.setState({
                displayedContactSwitchedNotification: this.currentUserMessages
            })
        })
        this.getListUser()
    }
    getListUser =  async () =>{
        const res = await firebase.firestore().collection("users").get()
        if(res.docs.length > 0){
            let listUsers = []
            listUsers = [...res.docs] 
            listUsers.forEach((item, index)=>{
                this.searchUsers.push({
                    key: index,
                    documentKey: item.id,
                    id: item.data().id,
                    name: item.data().name,
                    messages: item.data().messages,
                    URL: item.data().URL,
                    description: item.data().description
                })
            })
            this.setState({
                isLoading: false
            })
        }
        this.renderListUsers()
    }

    getClassnameforUserandNotification = (itemId) =>{
        let number = 0
        let className = ""
        let check = false
        if(this.state.currentPeerUser && this.state.currentPeerUser.id === itemId){
            className = "viewWrapItemFocused"
        }
        else{
            this.state.displayedContactSwitchedNotification.forEach(item =>{
                if(item.notificationId.length > 0){
                    if(item.notificationId === itemId){
                        check = true
                        number = item.number
                    }
                }
            })
            if(check === true){
                className = "viewWrapItemNotification"
            }
            else{
                className = "viewWrapItem"
            }
        }
        return className
    }

    notificationErase = (itemId) =>{
        this.state.displayedContactSwitchedNotification.forEach(el =>{
            if(el.notificationId.length > 0){
                if(el.notificationId !== itemId){
                    this.notificationMessagesErase.push({
                        notificationId: el.notificationId,
                        number: el.number
                    })
                }
            }
        })
        this.updaterenderList()
    }

    updaterenderList =() =>{
        firebase.firestore().collection("users").doc(this.currentUserDocumentId).update(
            {messages: this.notificationMessagesErase}
        )
        this.setState({
            displayedContactSwitchedNotification: this.notificationMessagesErase
        })
    }


    renderListUsers = () =>{
        if(this.searchUsers.length >0){
            let viewListUser = []
            let classname = ""
            this.searchUsers.map(item =>{
                if(item.id !== this.currentUserId){
                    classname = this.getClassnameforUserandNotification(item.id)
                    viewListUser.push(
                        <button id={item.key} className={classname} onClick={() =>{
                            this.notificationErase(item.id)
                            this.setState({currentPeerUser: item})
                            document.getElementById(item.key).style.backgroundColor = '#fff'
                            document.getElementById(item.key).style.color = '#fff'
                        }}>
                            <img className="viewAvatarItem" src={item.URL ? item.URL : null} alt=""/>
                            <div className="viewWrapContentItem">
                                <span className="textItem">
                                    {`${item.name}`}
                                </span>
                            </div>
                            {classname === "viewWrapItemNotification" ?
                            <div className="notificationpragraph">
                            <p id={item.key} className="newmessages">New messages</p>
                            </div> : null}
                        </button>
                    )
                }
            })
            this.setState({
                displayedContacts: viewListUser
            })
        }
        else{
            console.log("No users in here")
        }
    }

    
    search = (e) =>{
        let searchQuery = e.target.value.toLowerCase()
        console.log({searchQuery})
        this.displayedContacts = this.searchUsers.filter((el) =>{
            let searchValue = el.name.toLowerCase()
            return searchValue.indexOf(searchQuery) !== -1
        })
        this.displayedContacts = this.displayedContacts
        this.displaySearchedContact()
    }

    displaySearchedContact = () =>{
        if(this.searchUsers.length > 0){
            let viewListUser = []
            let classname = ""
            this.displayedContacts.map(itm =>{
                if(itm.id !== this.currentUserId){
                    classname = this.getClassnameforUserandNotification(itm.id)
                    viewListUser.push(
                        <button id={itm.key} className={classname} onClick={() =>{
                            this.notificationErase(itm.id)
                            this.setState({currentPeerUser: itm})
                            document.getElementById(itm.key).style.backgroundColor = '#fff'
                            document.getElementById(itm.key).style.color = '#fff'
                        }}>
                            <img className="viewAvatarItem" src={itm.URL ? itm.URL : null} alt=""/>
                            <div className="viewWrapContentItem">
                                <span className="textItem">
                                    {`${itm.name}`}
                                </span>
                            </div>
                            {classname === "viewWrapItemNotification" ?
                            <div className="notificationpragraph">
                            <p id={itm.key} className="newmessages">New messages</p>
                            </div> : null}
                        </button>
                    )
                }
            })
            this.setState({
                displayedContacts: viewListUser
            })
        }
        else{
            console.log("No users in here")
        }
    }



    render(){
        return(
            <div className="root">
                <div className="body">
                    <div className="viewListUser">
                        <div className="profileviewleftside">
                            <img className="ProfilePicture" alt="" src={this.currentUserPhoto ? this.currentUserPhoto : null} onClick={this.goProfile} />
                            <p className="name" onClick={this.goProfile}>{`${this.currentUserName}`}</p>
                            <button className="Logout" onClick={this.logout}>Log Out</button>
                        </div>
                        <div className="rootsearchbar">
                            <div className="input-container">
                                <i className="fa fa-search icon"></i>
                                <input className="input-field" type="text" onChange={this.search} placeholder="find a friend" />
                            </div>
                        </div>
                        {this.state.displayedContacts}
                    </div>
                    <div className="viewBoard">
                        {this.state.currentPeerUser ? (
                            <Box currentPeerUser={this.state.currentPeerUser} showToast={this.props.showToast} /> 
                        ): <Wlcm currentUserName = {this.currentUserName}  currentUserPhoto={this.currentUserPhoto}/>}
                    </div>
                </div>
            </div>
        )
    }
}