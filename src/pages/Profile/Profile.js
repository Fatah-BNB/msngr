import React, { Component } from 'react'
import './profile.css'
import ReactLoading from 'react-loading'
import 'react-toastify/dist/ReactToastify.css'
import firebase from '../../Services/firebase'
import images from '../../ProjectImages/PI'
import LoginStrings from '../Login/LoginStrings'


export default class Profile extends Component{
    constructor(props){
        super(props)
        this.state = {
            isLoading: false,
            documentKey: localStorage.getItem(LoginStrings.FirebaseDocumentId),
            id: localStorage.getItem(LoginStrings.ID),
            name: localStorage.getItem(LoginStrings.Name),
            aboutMe: localStorage.getItem(LoginStrings.Description),
            photoUrl: localStorage.getItem(LoginStrings.PhotoURL)
        }
        this.newPhoto = null
        this.newPhotoUrl = ""
    }

    componentDidMount(){
        if(!localStorage.getItem(LoginStrings.ID)){
            this.props.history.push("/")
        }
    }

    onChangeUsername = (e) =>{
        this.setState({
            name: e.target.value
        })
    }

    onChangeAboutMe = (e) =>{
        this.setState({
            aboutMe: e.target.value
        })
    }

    onChangeAvatar = (e) =>{
        if(e.target.files && e.target.files[0]){
            const prefixFileType = e.target.files[0].type.toString()
            if(prefixFileType.indexOf(LoginStrings.PREFIX_IMAGE) !== 0){
                this.props.showToast(0, "This file is not valid")
                return
            }
            this.newPhoto = e.target.files[0]
            this.setState({photoUrl: URL.createObjectURL(e.target.files[0])})
        }
        else{
            this.props.showToast(0, "seomthing went wrong")
        }
    }

    uploadAvatar = () =>{
        this.setState({isLoading: true})
        if(this.newPhoto){
            const uploadTask = firebase.storage().ref().child(this.state.id).put(this.newPhoto)
            uploadTask.on(LoginStrings.UPLOAD_CHANGED, null, err=>{
                this.props.showToast(0, err.message)
            }, () =>{
                uploadTask.snapshot.ref.getDownloadURL().then(downloadURL =>{
                    this.updateUserInfo(true, downloadURL)
                })
            })
        }
        else{
            this.updateUserInfo(false, null)
        }
    }

    updateUserInfo = (isUpdated, downloadURL) =>{
        let newInfo
        if(isUpdated){
            newInfo = {
                name: this.state.name,
                description: this.state.aboutMe,
                URL: downloadURL
            }
        }
        else{
            newInfo = {
                name: this.state.name,
                description: this.state.aboutMe
            }

        } 
            firebase.firestore().collection("users").doc(this.state.documentKey).update(newInfo)
            .then(data =>{
                localStorage.setItem(LoginStrings.Name, this.state.name)
                localStorage.setItem(LoginStrings.Description, this.state.aboutMe)
                if(isUpdated){
                    localStorage.setItem(LoginStrings.PhotoURL, downloadURL)
                }
                this.setState({isLoading: false})
                this.props.showToast(1, "Changes saved")
            })
    }

    render(){
        return(
            <div className="profileroot">
                <div className="headerprofile">
                    <span>Profile</span>
                </div>
                <img className="avatar" alt="" src={this.state.photoUrl ? this.state.photoUrl : null } />
                <div className="viewWrapInputFile">
                    <img className="imgInputFile" alt="icon gallery" src={images.chooseImage} onClick={()=>{this.refInput.click()}}/>
                    <input ref= {el =>{
                        this.refInput = el
                    }} accept="image/*" className="viewInputFile" type="File" onChange={this.onChangeAvatar} />
                </div>
                <span className="textLabel">Username</span>
                <input className="textInput" value={this.state.name ? this.state.name : ""} placeholder="Your username goes here" onChange={this.onChangeUsername} />
                <span className="textLabel">About me</span>
                <input className="textInput" value={this.state.aboutMe ? this.state.aboutMe : ""} placeholder="Say something about yourself" onChange={this.onChangeAboutMe} />

                <div>
                    <button className="btnUpdate" onClick={this.uploadAvatar}>Save</button>
                    <button className="btnback" onClick={() =>{this.props.history.push("/chat")}}>Back</button>
                </div>
                {this.state.isLoading ? (
                    <div>
                        <ReactLoading type={"spin"} color={"#203152"} height={"3%"} width={"3%"} />
                    </div>
                ) : null }
            </div>
        )
    }
}