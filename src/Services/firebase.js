import React from 'react'
import * as firebase from 'firebase'

var firebaseConfig = {
    apiKey: "AIzaSyDbWJyuuWec2yXHIyx-ZUreVwR0BN1LAEo",
    authDomain: "msngr-84232.firebaseapp.com",
    databaseURL: "https://msngr-84232.firebaseio.com",
    projectId: "msngr-84232",
    storageBucket: "msngr-84232.appspot.com",
    messagingSenderId: "427009249614",
    appId: "1:427009249614:web:32804f56c99443a54b0e1f",
    measurementId: "G-EX1PT8J8VE"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();



export default firebase