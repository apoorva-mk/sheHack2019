var express = require('express');
var router = express.Router();
const axios = require('axios');
var url = require('url');
var store = require('store');

router.get('/', (req, res)=>{
	res.render('login');
});

var firebase = require("firebase-admin");

var serviceAccount = require("./ebech-nitk-firebase-adminsdk-zvta7-a138802f2e.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://ebech-nitk.firebaseio.com"
});

var db = firebase.database();
var userref = db.ref("users");

router.get('/validation/', (req,res) => {
	console.log("validating");
	var email = req.query.email;
	var password = req.query.password;
	console.log(email);
	userref.once('value', function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
		var childKey = childSnapshot.val();
			if(childKey.email===email){
				store.set('currentUser', {name: childKey.name, email: childKey.email, uid: childKey.uid });
			} 
	    });	
	    console.log("Connected to database");
	    console.log(store.get('currentUser'));
	    res.redirect('/products');
	});
	
	// var to_send = {
	// 	method : 'get',
	// 	url: '/products/',
	// 	data : {
	// 		user_email : email 
	// 	}
	// }

	//axios.get('/products');//, {
		 // user_email : email 
	//});

});



module.exports = router;