var express = require('express');
var router = express.Router();
const axios = require('axios');
var url = require('url');
var username = "";
var store = require('store');


var firebase = require("firebase-admin");

var serviceAccount = require("./ebech-nitk-firebase-adminsdk-zvta7-a138802f2e.json");

	// firebase.initializeApp({
	//   credential: firebase.credential.cert(serviceAccount),
	//   databaseURL: "https://ebech-nitk.firebaseio.com"
	// });

function bubbleSort(arr){
   var len = arr.length;
   for (var i = len-1; i>=0; i--){
     for(var j = 1; j<=i; j++){
       if(arr[j-1].price>arr[j].price){
           var temp = arr[j-1];
           arr[j-1] = arr[j];
           arr[j] = temp;
        }
     }
   }
   return arr;
}

class Product {
  constructor(id, category, price, seller, open, desc, file) {
    this.pid = id;
    this.category = category;
    this.price = price;
    this.seller = seller;
    this.open = open;
    this.desc = desc;
    this.filename = file;
  }
}

class Pending {
	constructor(contact, name, pid){
		this.contact = contact;
		this.name = name;
		this.id = pid;
	}
}

var db = firebase.database();
var ref = db.ref("products");

var products = [];
ref.once('value', function(snapshot) {
	snapshot.forEach(function(childSnapshot) {
	var childKey = childSnapshot.val();
	var temp = new Product(childKey.id, childKey.category, childKey.price, childKey.seller, childKey.open, childKey.desc, childKey.filename);
	products.push(temp); 
    });	
    console.log("Connected to database");
});

console.log(ref); 	

router.get('/', (req, res) => {
	console.log("################");
	console.log(store.get("currentUser"));
	var name = store.get("currentUser").name;
	console.log(name);
	res.render("products", {result: products, userName : name});
});

router.get('/books', (req, res) => {
	var books = [];
	for (var i in products) {
		if(products[i].category === 'books')
	  		books.push(products[i]);
	}
	var name = store.get("currentUser").name;
	console.log(name);
	res.render("products", {result: books, userName: name});
	console.log(products);
});

router.get('/appliances', (req, res) => {
	var appliances = [];
	for (var i in products) {
		if(products[i].category === 'appliances')
	  		appliances.push(products[i]);
	}
	var name = store.get("currentUser").name;
	console.log(name);
	res.render("products", {result: appliances, userName: name});
});

router.get('/household', (req, res) => {
	var household = [];
	for (var i in products) {
		if(products[i].category === 'household')
	  		household.push(products[i]);
	}
	var name = store.get("currentUser").name;
	console.log(name);
	res.render("products", {result: household, userName:name});
	console.log(products);
});


router.get('/furniture', (req, res) => {
	var furniture= [];
	for (var i in products) {
		if(products[i].category === 'furniture')
	  		furniture.push(products[i]);
	}
	var name = store.get("currentUser").name;
	console.log(name);
	res.render("products", {result: furniture,userName:name });
	console.log(products);
});

router.get('/search/', (req, res) => {
	console.log(req);
	var query = req.query.Search; 
	console.log(query);
	var search_results= [];
	for (var i in products) {

	  	if(products[i].desc.includes(query))
			{
				search_results.push(products[i]);
			}
	}
	var name = store.get("currentUser").name;
	res.render("products", {result: search_results,  userName:name});
	//console.log(products);
});

router.get('/buy/', (req, res) => {
	var itemId = req.query.itemId;
	var sellerId = req.query.seller;
	var itemName = req.query.itemName;

	console.log(itemId+" "+sellerId);
	res.redirect('/products');

	var sellerRef = db.ref("users/"+sellerId);
    var requests=sellerRef.child("pending/");
    var buyer = store.get("currentUser").email;
    var temp = new Pending(buyer, itemName, itemId);
    requests.child(itemId).set(temp);
});

router.get('/sort/', (req, res) => {
	var sorted = bubbleSort(products);
	var name = store.get("currentUser").name;
	res.render("products", {result: products,userName:name });
});



module.exports = router;
