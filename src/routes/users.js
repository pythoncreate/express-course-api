"use strict";

const express = require("express");
const router = express.Router();

const User = require("../models/user");
const mid = require('../middleware');

// GET /api/users 200 - Returns the currently authenticated user
router.get('/', mid.requiresLogin, function(req, res) {
    res.json(req.LoggedInUser);
    res.status(200);
});

//POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
router.post('/', function(req,res,next){
    var userData = {
      fullName: req.body.fullName,
      emailAddress: req.body.emailAddress,
      password: req.body.password
    };

    User.create(userData, function(error,user){
     if(error){ 
      return next(error);
    } else {
      return res.location('/').status(201).json();
    }
});
});

module.exports = router;