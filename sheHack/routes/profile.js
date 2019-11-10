var express = require('express');
var router = express.Router();
const axios = require('axios');
var url = require('url');
var store = require('store');

var pending = [];
var sold = [];
var bought = [];
var requests = [];

var firebase = require("firebase-admin");

var serviceAccount = require("./ebech-nitk-firebase-adminsdk-zvta7-a138802f2e.json");

var db = firebase.database();

class Pending {
	constructor(contact, name, pid){
		this.contact = contact;
		this.name = name;
		this.id = pid;
	}
}


router.get("/", (req, res) => {
	//res.send('prof');
	var name = store.get('currentUser').name;
	var email = store.get('currentUser').email;
	var uid = store.get('currentUser').uid;
	console.log("%%%%",uid);
	//res.render('profile', {name: name, email: email});

	var ref = db.ref("users/"+uid+"/pending");
	if(ref){
		ref.once('value', function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
				var childKey = childSnapshot.val();
				var temp = new Pending(childKey.contact, childKey.name, childKey.id);
				pending.push(temp);
		    });	
		    console.log(pending);
		    res.render('profile', {name: name, email: email, result: pending});
		});
	}

});

router.get("/sold", (req, res) => {
	pending = [];
	var name = store.get('currentUser').name;
	var email = store.get('currentUser').email;
	var uid = store.get('currentUser').uid;
	console.log("%%%%",uid);

	var ref = db.ref("users/"+uid+"/sold");
	if(ref){
		// ref.once('value', function(snapshot) {
		// 	snapshot.forEach(function(childSnapshot) {
		// 		var childKey = childSnapshot.val();
		// 		var temp = new Pending(childKey.contact, childKey.name, childKey.id);
		// 		pending.push(temp);
		//     });	
		//     console.log(pending);
		//     res.render('profile', {name: name, email: email, result: pending});
		// });
	}

});


module.exports = router;
