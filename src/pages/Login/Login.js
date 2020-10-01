import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import firebase from '../../Services/firebase'
import LoginStrings from './LoginStrings'
import './login.css'
import {Card} from 'react-bootstrap'
import Avatar from '@material-ui/core/Avatar'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'

export default class Login extends Component{
    constructor(props){
        super(props)
        this.state={
            isLoading: true,
            email: "",
            password: ""
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    componentDidMount(){
        if(localStorage.getItem(LoginStrings.ID)){
            this.setState({isLoading: false}, ()=>{
                this.setState({isLoading: false})
                this.props.showToast(1, 'Login success')
                this.props.history.push('/chat')
            })
        }
        else{
            this.setState({isLoading: false})
        }
    }

    async handleSubmit(e){
        e.preventDefault()

        await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then (async res=>{
            let user = res.user
            if(user){
                await firebase.firestore().collection('users')
                .where('id', "==", user.uid)
                .get()
                .then(function(querySnapshot){
                     querySnapshot.forEach(function(doc){
                         const curretData = doc.data()
                         localStorage.setItem(LoginStrings.FirebaseDocumentId, doc.id)
                         localStorage.setItem(LoginStrings.ID, curretData.id)
                         localStorage.setItem(LoginStrings.Name, curretData.name)
                         localStorage.setItem(LoginStrings.Email, curretData.email)
                         localStorage.setItem(LoginStrings.Password, curretData.password)
                         localStorage.setItem(LoginStrings.PhotoURL, curretData.URL)
                         localStorage.setItem(LoginStrings.Description, curretData.description)
                     })
                })
            }
            this.props.history.push("/chat")
        }).catch(function(error){
             document.getElementById('1').innerHTML = "seems like your email or password is not correct :("
        })
    }


    render(){
        const paper ={
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingLeft: '10px',
            paddingRight: '10px'
        }
        const rightComponent ={
            boxShadow: '0 80px 80px #808888',
            backgroundColor: 'smokegrey'
        }
        const root ={
            height: '100vh',
            background: 'white',
        }
        const signinsee ={
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'white',
            marginBottom: '20px',
            backgroundColor: '#262626',
            width: '100%',
            boxShadow: '0 5px 5px #808888',
            height: '10rem',
            paddingTop: '48px'
        }
        const form ={
            width: '100%',
            marginTop: '50px'
        }
        const avatar ={
            backgroundColor: '#e74c3c'
        }
        return(
            <Grid container component="main" style={root}>
                <CssBaseline/>
                <Grid item xs={1} sm={4} md={7} className="image" >
                    <div className="image1"></div>
                </Grid>
                <Grid item xs={12} sm={8} md={5} style={rightComponent} elevation={6} square>
                    <Card style={signinsee}>
                        <div>
                            <Avatar style={avatar}>
                                <LockOutlinedIcon width="50px" height="50px" />
                            </Avatar>
                        </div>
                        <div>
                            <Typography component="h1" varianr="h5" Sign in To />
                        </div>
                        <div>
                            <Link to="/"><button className="btnn"><i className="fa fa-home"></i>MSNGR</button></Link>
                        </div>
                    </Card>
                    <div style={paper}>
                        <form style={form} noValidate onSubmit={this.handleSubmit}>
                            <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Email address" name="email" autoComplete="email" autoFocus onChange={this.handleChange} value={this.state.email} />
                            <TextField variant="outlined" margin="normal" required fullWidth id="password" label="Password" name="password" autoComplete="current-password" type="password" autoFocus onChange={this.handleChange} value={this.state.password} />
                            <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
                            <Typography component="h6" variant="h5" >
                            {this.state.error ? (<p className="text-danger">{this.state.error}</p>) : null}
                            </Typography>
                            <div className="CenterAliningItems">
                                <button className="button1" type="submit">
                                    <span>Login In</span>
                                </button>
                            </div>
                            <div className="CenterAliningItems">
                                <p>Don't have an account yet ?</p>
                                <Link to="/signup" varianr="body2">Sign up</Link>
                            </div>
                            <div className="error">
                                <p id="1" style={{color:'red'}}></p>
                            </div>
                        </form>
                    </div>
                </Grid>
            </Grid>
        )
    }
}