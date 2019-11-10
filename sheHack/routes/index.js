var express = require('express');
var router = express.Router();
const axios = require('axios');

router.get('/', (req, res)=>{
	res.redirect("/login");

});

module.exports = router;
