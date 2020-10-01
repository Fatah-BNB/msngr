import React, { Component } from 'react'
import './footer.css'


class Footer extends Component{
    // CopyRight = () =>{
    //     return(
    //         <h2 variant="body2" color="textSecondary" align="center">
    //             {'Copyright © '} 
    //             {'MSNGR'}
    //             {new Date().getFullYear()} 
    //             {'.'}
    //         </h2>
    //     )      
    // }

    render(){
        return(
            <Footer>
                <div className="footer 1Box isCenter">
                    {/* {this.CopyRight} */}
                    CopyRights 2020
                </div>
            </Footer>
        )
    }

}


export default Footer