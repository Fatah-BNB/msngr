import React, { Component } from 'react'
import {Card} from 'react-bootstrap'
import ReactLoading from 'react-loading'
import 'react-toastify/dist/ReactToastify.css'
import firebase from '../../Services/firebase'
import images from '../../ProjectImages/PI'
import Moment from 'moment'
import './box.css'
import LoginStrings from '../Login/LoginStrings'
import 'bootstrap/dist/css/bootstrap.min.css'



export default class Box extends Component{

    constructor(props){
        super(props)
        this.state={
            isLoading: false,
            showSticker: false,
            inputValue: ""
        }
        this.currentUserName = localStorage.getItem(LoginStrings.Name)
        this.currentUserId = localStorage.getItem(LoginStrings.ID)
        this.currentUserPhoto = localStorage.getItem(LoginStrings.PhotoURL)
        this.currentUserDocumentId = localStorage.getItem(LoginStrings.FirebaseDocumentId)
        this.stateChanged = localStorage.getItem(LoginStrings.UPLOAD_CHANGED)
        this.currentPeerUser = this.props.currentPeerUser
        this.groupChatId = null
        this.currentPeerUserMessages = []
        this.listMessages = []
        

        firebase.firestore().collection("users").doc(this.currentPeerUser.documentKey).get()
        .then((docRef)=>{
            this.currentPeerUserMessages = docRef.data().messages
        })
    }

    componentDidUpdate(){
        this.scrollToBottom()
    }


    componentWillReceiveProps(newProps){
        if(newProps.currentPeerUser){
            this.currentPeerUser = newProps.currentPeerUser 
            this.getListHistory()
        }
    }

    componentDidMount(){
        this.getListHistory()
    }
    componentWillUnmount(){
        if(this.removeListener){
            this.removeListener()
        }
    }

    getListHistory = () =>{
        if(this.removeListener){
            this.removeListener()
        }
        this.listMessages.length = 0
        this.setState({isLoading: true})
        if(this.hashString(this.currentUserId) <= this.hashString(this.currentPeerUser.id)){
            this.groupChatId = `${this.currentUserId} - ${this.currentPeerUser.id}`
        }
        else{
            this.groupChatId = `${this.currentPeerUser.id} - ${this.currentUserId}`
        }
        this.removeListener = firebase.firestore().collection("Messages").doc(this.groupChatId).collection(this.groupChatId)
        .onSnapshot(Snapshot=>{
            Snapshot.docChanges().forEach(change =>{
                if(change.type === LoginStrings.DOC){
                    this.listMessages.push(change.doc.data())
                }
            })
            this.setState({isLoading: false})
        },
        err =>{this.props.showToast(0, err.toString())})
    }


    sendMessage = (content, type) =>{
        let notificationMessages = []
        if(this.state.showSticker && type === 2){
            this.setState({showSticker: false})
        }
        if(content.trim() === ""){
            return
        }
        const timestamp = Moment().valueOf().toString()
        const itemMessage  = {
            idFrom: this.currentUserId,
            idTo: this.currentPeerUser.id,
            timestamp: timestamp,
            content: content.trim(),
            type: type
        }
        firebase.firestore().collection("Messages").doc(this.groupChatId).collection(this.groupChatId).doc(timestamp).set(itemMessage)
        .then(()=>{
            this.setState({inputValue: ""})
        })
        this.currentPeerUserMessages.map( i =>{
            if(i.notificationId !== this.currentUserId){
                notificationMessages.push(
                    {
                        notificationId: i.notificationId,
                        number: i.number
                    }
                )
            }
        })
        firebase.firestore().collection("users").doc(this.currentPeerUser.documentKey).update({
            messages: notificationMessages
        })
        .then(data => {}).catch( err =>{this.props.showToast(0, err.toString())})
    }

    scrollToBottom = () =>{
        if(this.messagesEnd){
            this.messagesEnd.scrollIntoView({})
        }
    }

    onKeyBoardPress = e =>{
        if(e.key === 'Enter'){
            this.sendMessage(this.state.inputValue, 0)
        }
    }

    openListSticker = () =>{
        this.setState({showSticker: !this.state.showSticker})
    }

    openImgRight = () =>{
        var see = document.getElementById('imgRight')
        see.classList.toggle('big')
    }
    openImgLeft = () =>{
        var see = document.getElementById('imgLeft')
        see.classList.toggle('big')
    }

    renderListMessages = () =>{
        if(this.listMessages.length > 0){
            let viewListMessages = []
            this.listMessages.forEach((item, index)=>{
                if(item.idFrom === this.currentUserId){
                    if(item.type === 0){
                        viewListMessages.push(
                            <div className="viewItemRight" key={item.timestamp}>
                                <span className="textContentItem">{item.content}</span>
                            </div>
                        )
                    }
                    else if(item.type === 1){
                        viewListMessages.push(
                            <div className="viewItemRight2" key={item.timestamp} >
                                <img id="imgRight" className="imgItemRight" src={item.content} alt="something went wrong" title="double click to see image" onDoubleClick={this.openImgRight} />
                            </div>
                        )
                    }
                    else{
                        viewListMessages.push(
                            <div className="viewItemRight3" key={item.timestamp}>
                                <img className="imgItemRight" src={this.getGifImage(item.content)} alt="content message" />
                            </div>
                        )
                    }
                }
                else{
                    if(item.type === 0){
                        viewListMessages.push(
                            <div className="viewWrapItemLeft" key={item.timestamp}>
                                <div className="viewWrapItemLeft3">
                                    {this.lastMessageLeft(index) ? (
                                        <img src={this.currentPeerUser.URL} alt="avatar" className="peerAvatarLeft" />
                                    ): (
                                        <div className="viewPaddingLeft" />
                                    )}
                                    <div className="viewItemLeft">
                                        <span className="textContentItem">{item.content}</span>
                                    </div>
                                </div>
                                {this.lastMessageLeft(index) ? (
                                   <span className="textTimeLeft">
                                       <div className="time">
                                           {Moment(Number(item.timestamp)).format('ll')}
                                       </div>
                                   </span>
                                ) : null}
                            </div>
                        )
                    }
                    else if(item.type === 1){
                        viewListMessages.push(
                            <div className="viewWrapItemLeft2" key={item.timestamp}>
                                <div className="viewWrapItemLeft3">
                                    {this.lastMessageLeft(index) ? (
                                        <img src={this.currentPeerUser.URL} alt="avatar" className="peerAvatarLeft" />
                                    ): (
                                        <div className="viewPaddingLeft" />
                                    )}
                                    <div className="viewItemLeft2">
                                        <img id="imgLeft" src={item.content} alt="content message" className="imgItemLeft" onDoubleClick={this.openImgLeft} />
                                    </div>
                                    </div>
                                    {this.lastMessageLeft(index) ? (
                                   <span className="textTimeLeft">
                                       <div className="time">
                                           {Moment(Number(item.timestamp)).format('ll')}
                                       </div>
                                   </span>
                                ) : null}
                                    </div>)
                    }
                    else{
                        viewListMessages.push(
                            <div className="viewWrapItemLeft2" key={item.timestamp}>
                            <div className="viewWrapItemLeft3">
                                {this.lastMessageLeft(index) ? (
                                    <img src={this.currentPeerUser.URL} alt="avatar" className="peerAvatarLeft" />
                                ): (
                                    <div className="viewPaddingLeft" />
                                )}
                                <div className="viewItemLeft3" key={item.timestamp}>
                                <img className="imgItemRight" src={this.getGifImage(item.content)} alt="content message" />
                                </div>
                                </div>
                                {this.lastMessageLeft(index) ? (
                                   <span className="textTimeLeft">
                                       <div className="time">
                                           {Moment(Number(item.timestamp)).format('ll')}
                                       </div>
                                   </span>
                                ) : null}
                                </div>
                        )
                    }
                }
            })
            return viewListMessages
        }
        else{
            return(
                <div className="viewWrapSayHi">
                    <span className="textSayHi">Say Hi to your new friend</span>
                    <img className="imgWaveHand" src={images.hello} alt="say hello" />
                </div>
            )
        }
    }

    ChoosePhoto = e =>{
        if(e.target.files && e.target.files[0]){
            this.setState({isLoading: true})
            this.currentPhotoFile = e.target.files[0]
            const prefixFiletype = e.target.files[0].type.toString()
            if(prefixFiletype.indexOf("image/") === 0){
                this.uploadPhoto()
            }
            else{
                this.setState({isLoading: false})
                this.props.showToast(0, "this file is not valid")
            }
        }
        else{
            this.setState({isLoading: false})
        }
    }

    uploadPhoto = () =>{
        if(this.currentPhotoFile){
            const timestamp = Moment().valueOf().toString()
            const uploadTask = firebase.storage().ref().child(timestamp).put(this.currentPhotoFile)
            uploadTask.on(
                LoginStrings.UPLOAD_CHANGED, null, err=>{this.setState({isLoading: false})
                this.props.showToast(0, err.message) 
            }, () =>{
                uploadTask.snapshot.ref.getDownloadURL().then(downloadURL =>{
                    this.setState({isLoading: false})
                    this.sendMessage(downloadURL, 1)
                })
            }
            )
        }
        else{
            this.setState({isLoading: false})
            this.props.showToast(0, "File is empty")
        }
    }


    render(){
        return(
            <Card className="viewChatBoard">
                <div className="headerChatBoard">
                    <img alt="" className="viewAvatarItem" src={this.currentPeerUser.URL ? this.currentPeerUser.URL: null} />
                    <span className="textHeaderChatBoard">
                        <p style={{fontSize:'20px'}}>{this.currentPeerUser.name}</p>
                    </span>
                    <div className="aboutme">
                        <span>
                            <p>{this.currentPeerUser.description}</p>
                        </span>
                    </div>
                </div>
                <div className="viewListContentChat">
                    {this.renderListMessages()}
                    <div style={{float:'left', clear:'both'}} ref={el =>{
                        this.messagesEnd = el
                    }} />
                </div>
                {this.state.showSticker ? this.renderStickers() : null}
                <div className="viewBottom">
                    <img className="icOpenGallery" src={images.photo} alt="add photo" onClick={()=>{this.refInput.click()}} />
                    <input ref= {el =>{this.refInput = el}} className="viewInputGallery" accept="images/*" type="File" onChange={this.ChoosePhoto} />
                    <img className="icOpenSticker" src={images.sticker} alt="add sticker" onClick={this.openListSticker} />
                    <input className="viewInput" placeholder="type a message.." value={this.state.inputValue} onChange={e =>{
                        this.setState({inputValue: e.target.value})
                    }} 
                        onKeyPress = {this.onKeyBoardPress}
                    />
                    <img className="icSend" src={images.send} alt="send" onClick={()=>{this.sendMessage(this.state.inputValue, 0)}} />
                </div>
                {this.state.isLoading ? (
                <div className="viewLoading">
                    <ReactLoading type={'spin'} color={'#203152'} height={'3%'} width={'3%'} />
                </div>
            ) : null }
            </Card>
        )
    }

    renderStickers = () =>{
        return(
            <div className="viewStickers">
                <img className="imgSticker" src={images.stkr1} alt="sticker" onClick={()=>{this.sendMessage('stkr1', 2)}} />
                <img className="imgSticker" src={images.stkr2} alt="sticker" onClick={()=>{this.sendMessage('stkr2', 2)}} />
                <img className="imgSticker" src={images.stkr3} alt="sticker" onClick={()=>{this.sendMessage('stkr3', 2)}} />
                <img className="imgSticker" src={images.stkr4} alt="sticker" onClick={()=>{this.sendMessage('stkr4', 2)}} />
                <img className="imgSticker" src={images.stkr5} alt="sticker" onClick={()=>{this.sendMessage('stkr5', 2)}} />
                <img className="imgSticker" src={images.stkr6} alt="sticker" onClick={()=>{this.sendMessage('stkr6', 2)}} />
                <img className="imgSticker" src={images.stkr7} alt="sticker" onClick={()=>{this.sendMessage('stkr7', 2)}} />
                <img className="imgSticker" src={images.stkr8} alt="sticker" onClick={()=>{this.sendMessage('stkr8', 2)}} />
                <img className="imgSticker" src={images.stkr9} alt="sticker" onClick={()=>{this.sendMessage('stkr9', 2)}} />
                <img className="imgSticker" src={images.stkr10} alt="sticker" onClick={()=>{this.sendMessage('stkr10', 2)}} />
                <img className="imgSticker" src={images.stkr11} alt="sticker" onClick={()=>{this.sendMessage('stkr11', 2)}} />
                <img className="imgSticker" src={images.stkr12} alt="sticker" onClick={()=>{this.sendMessage('stkr12', 2)}} />
                <img className="imgSticker" src={images.stkr13} alt="sticker" onClick={()=>{this.sendMessage('stkr13', 2)}} />
                <img className="imgSticker" src={images.stkr14} alt="sticker" onClick={()=>{this.sendMessage('stkr14', 2)}} />
                <img className="imgSticker" src={images.stkr15} alt="sticker" onClick={()=>{this.sendMessage('stkr15', 2)}} />
                <img className="imgSticker" src={images.stkr16} alt="sticker" onClick={()=>{this.sendMessage('stkr16', 2)}} />
                <img className="imgSticker" src={images.stkr17} alt="sticker" onClick={()=>{this.sendMessage('stkr17', 2)}} />
                <img className="imgSticker" src={images.stkr18} alt="sticker" onClick={()=>{this.sendMessage('stkr18', 2)}} />
                <img className="imgSticker" src={images.stkr19} alt="sticker" onClick={()=>{this.sendMessage('stkr19', 2)}} />
                <img className="imgSticker" src={images.stkr20} alt="sticker" onClick={()=>{this.sendMessage('stkr20', 2)}} />
                <img className="imgSticker" src={images.stkr21} alt="sticker" onClick={()=>{this.sendMessage('stkr21', 2)}} />
                <img className="imgSticker" src={images.stkr22} alt="sticker" onClick={()=>{this.sendMessage('stkr22', 2)}} />
                <img className="imgSticker" src={images.stkr23} alt="sticker" onClick={()=>{this.sendMessage('stkr23', 2)}} />
                <img className="imgSticker" src={images.stkr24} alt="sticker" onClick={()=>{this.sendMessage('stkr24', 2)}} />
                <img className="imgSticker" src={images.stkr25} alt="sticker" onClick={()=>{this.sendMessage('stkr25', 2)}} />
                <img className="imgSticker" src={images.stkr26} alt="sticker" onClick={()=>{this.sendMessage('stkr26', 2)}} />
                <img className="imgSticker" src={images.stkr27} alt="sticker" onClick={()=>{this.sendMessage('stkr27', 2)}} />
                <img className="imgSticker" src={images.stkr28} alt="sticker" onClick={()=>{this.sendMessage('stkr28', 2)}} />
                <img className="imgSticker" src={images.stkr29} alt="sticker" onClick={()=>{this.sendMessage('stkr29', 2)}} />
                <img className="imgSticker" src={images.stkr30} alt="sticker" onClick={()=>{this.sendMessage('stkr30', 2)}} />
                <img className="imgSticker" src={images.stkr31} alt="sticker" onClick={()=>{this.sendMessage('stkr31', 2)}} />
                <img className="imgSticker" src={images.stkr32} alt="sticker" onClick={()=>{this.sendMessage('stkr32', 2)}} />
                <img className="imgSticker" src={images.stkr33} alt="sticker" onClick={()=>{this.sendMessage('stkr33', 2)}} />
                <img className="imgSticker" src={images.stkr34} alt="sticker" onClick={()=>{this.sendMessage('stkr34', 2)}} />
                <img className="imgSticker" src={images.stkr35} alt="sticker" onClick={()=>{this.sendMessage('stkr35', 2)}} />
            </div>
        )
    }

    getGifImage = value =>{
        switch(value){
            case 'stkr1': return images.stkr1
            case 'stkr2': return images.stkr2
            case 'stkr3': return images.stkr3
            case 'stkr4': return images.stkr4
            case 'stkr5': return images.stkr5
            case 'stkr6': return images.stkr6
            case 'stkr7': return images.stkr7
            case 'stkr8': return images.stkr8
            case 'stkr9': return images.stkr9
            case 'stkr10': return images.stkr10
            case 'stkr11': return images.stkr11
            case 'stkr12': return images.stkr12
            case 'stkr13': return images.stkr13
            case 'stkr14': return images.stkr14
            case 'stkr15': return images.stkr15
            case 'stkr16': return images.stkr16
            case 'stkr17': return images.stkr17
            case 'stkr18': return images.stkr18
            case 'stkr19': return images.stkr19
            case 'stkr20': return images.stkr20
            case 'stkr21': return images.stkr21
            case 'stkr22': return images.stkr22
            case 'stkr23': return images.stkr23
            case 'stkr24': return images.stkr24
            case 'stkr25': return images.stkr25
            case 'stkr26': return images.stkr26
            case 'stkr27': return images.stkr27
            case 'stkr28': return images.stkr28
            case 'stkr29': return images.stkr29
            case 'stkr30': return images.stkr30
            case 'stkr31': return images.stkr31
            case 'stkr32': return images.stkr32
            case 'stkr33': return images.stkr33
            case 'stkr34': return images.stkr34
            case 'stkr35': return images.stkr35
        }
    }

    hashString = str =>{
        let hash = 0
        for (let k = 0; k < str.length; k++){
            hash += Math.pow(str.charCodeAt(k) * 31, str.length - k)
            hash = hash && hash
        }
        return hash
    }

    lastMessageLeft(index){
        if(index+1 < this.listMessages.length && this.listMessages[index+1].idFrom === this.currentUserId || index === this.listMessages.length-1){
            return true
        }
        else{
            return false
        }
    }

    lastMessageRight(index){
        if(index+1 < this.listMessages.length && this.listMessages[index+1].idFrom !== this.currentUserId || index === this.listMessages.length-1){
            return true
        }
        else{
            return false
        }
    }

}