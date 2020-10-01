import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import './signup.css'
import firebase from '../../Services/firebase'
import cssBaseline from '@material-ui/core/CssBaseline'
import {Card} from 'react-bootstrap'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import CssBaseline from '@material-ui/core/CssBaseline'
import LoginStrings from '../Login/LoginStrings'


export default class Signup extends Component{
    constructor(){
        super()
        this.state={
            email: "",
            password: "",
            name: "",
            error: null
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    async handleSubmit(e){
        const {name, password, email} = this.state
        e.preventDefault()
        try{
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(async res =>{
                firebase.firestore().collection("users")
                .add({
                    name,
                    id: res.user.uid,
                    email,
                    password,
                    URL: '',
                    description: '',
                    messages: [{notificationId: "",number: 0}]
                }).then((docRef)=>{
                    localStorage.setItem(LoginStrings.ID, res.user.uid)
                    localStorage.setItem(LoginStrings.Name, name)
                    localStorage.setItem(LoginStrings.Email, email)
                    localStorage.setItem(LoginStrings.Password, password)
                    localStorage.setItem(LoginStrings.PhotoURL, "")
                    localStorage.setItem(LoginStrings.UPLOAD_CHANGED, "state_changed")
                    localStorage.setItem(LoginStrings.Description, "")
                    localStorage.setItem(LoginStrings.FirebaseDocumentId , docRef.id)
                    this.setState({
                        name: '',
                        password: '',
                        url: ''
                    })
                    this.props.history.push("/chat")
                })
                .catch((error)=>{
                    console.log("error adding document ",error)
                })
            })
        }
        catch (error){
            document.getElementById('1').innerHTML = "Error in signing up, try again if you want"
        }
    }

    render(){
        const Signinsee = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'white',
            backgroundColor: '#262626',
            width: '100%',
            boxShadow: "0 5px 5px black",
            height: '10rem',
            paddingTop: '48px',
        }
        return(
            <div>
                <CssBaseline/>
                <Card style={Signinsee}>
                    <div>
                        <Typography component="h1" variant="h5">
                            Sign Up
                            To    
                        </Typography> 
                    </div>
                    <div>
                        <Link to="/">
                            <button className="btnLogin"><i className="fa fa-home"></i>MSNGR</button>
                        </Link>
                    </div>
                </Card>
                <Card className="formacontrooutside">
                    <form className="customform" noValidate onSubmit={this.handleSubmit}>
                        <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Email address" name="email" autoComplete="email" autoFocus onChange={this.handleChange} value={this.state.email} />
                        <div><p style={{color:'gray', fontSize:'15px', marginLeft:'0', marginBottom:'0', marginTop:'20px', opacity:'50%'}}>password should be more than 6 characters</p></div>
                        <TextField variant="outlined" margin="normal" required fullWidth id="password" label="Password" name="password" autoComplete="current-password" type="password" autoFocus onChange={this.handleChange} value={this.state.password} />
                        <TextField variant="outlined" margin="normal" required fullWidth id="name" label="Username" name="name" autoComplete="name" autoFocus onChange={this.handleChange} value={this.state.name} />
                        <div><p style={{color:'gray', fontSize:'15px'}}>All fields are required</p></div>
                        <div className="CenterAliningItems">
                            <button className="button1" type="submit"><span>Sign Up</span></button>
                        </div>
                        <div>
                            <p style={{color:'gray'}}>Already have an account ?</p>
                            <Link to="/login">Login In</Link>
                        </div>
                        <div className="error">
                            <p id="1" style={{color:'red'}}></p>
                        </div>
                    </form>
                </Card>
            </div>
        )
    }
}