var express = require('express');
var router = express.Router();
const axios = require('axios');
var url = require('url');
var store = require('store');
var multer = require('multer');
var bodyParser = require('body-parser');

const upload = multer({dest: 'public/images'});
console.log(upload);

router.get('/', (req, res) => {
	res.render('upload');
});

var firebase = require("firebase-admin");

var serviceAccount = require("./ebech-nitk-firebase-adminsdk-zvta7-a138802f2e.json");
var db = firebase.database();
var ref = db.ref("products");

class Product {
	constructor(category, desc, filename, id, open, price, seller){
		this.category = category;
		this.desc = desc;
		this.filename = filename;
		this.id = id;
		this.open = open;
		this.price = price;
		this.seller = seller;
	}
}

router.post('/upload_prod', upload.any(), (req, res) => {
	console.log(req.files[0].filename);
	console.log("hereeee - --- ---");
	store.set('filename', {name: req.files[0].filename});
	res.redirect("/upload/detail");	
});

router.get('/detail', (req, res) => {
	res.render('uploaddetails');
});

router.get('/details', (req, res) => {
	console.log("RRRRR");
	var file = store.get('filename').name;
	var name = store.get('currentUser').uid;
	var temp = new Product(req.query.category, req.query.desc, file, file, 1,req.query.price ,name );
	ref.child(file).set(temp);
	res.redirect('/products');
});

router.post('/upload_prod/detail', upload.any(), (req, res) => {
	console.log(req.files[0].filename);
	console.log("hereeee");
	var file = store.get('filename').name;
	res.send(req.files);	
});




module.exports = router;
