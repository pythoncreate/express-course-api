"use-strict";

const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Course = require("../models/course");
const Review = require("../models/review");
const mid = require('../middleware');

router.param("courseId", function(req,res,next,id) {
    Course.findById(id).
    populate('user').
    populate('review').
    exec(function(err,doc){
        if(err) return next(err);
        if(!doc){
            err = new Error("Not Found");
            err.status = 404;
            return next(err);
        }
        req.course = doc;
        return next();
    });
});

// GET /api/courses 200 - Returns the Course "_id" and "title" properties
router.get("/", (req,res,next) => {
    Course.find({}, 'course_id title', function(err, courses){
        if(err) {
           err.status = 400 
           return next(err);
        }
        res.json(courses);
    });
});

// GET /api/course/:courseId 200 - Returns all Course properties and related 
// documents for the provided course ID
// use Mongoose population to load the related user and reviews documents.
router.get("/:courseId", (req, res, next) =>{
    res.json(req.course);
})


// POST /api/courses 201 - Creates a course, sets the Location header, and returns no content
router.post("/", mid.requiresLogin, (req, res, next) => {
    let course = new Course(req.body);
    course.save(function(err, course){
        if(err){
            res.status(400);
            return next(err);
        } else {
            res.location('/');
            res.status(201).json();
        }
    })
});

// PUT /api/courses/:courseId 204 - Updates a course and returns no content
router.put("/:courseId", mid.requiresLogin, (req,res,next) => {
    req.course.update(req.body, function(err,result){
        if(err){
            res.status(400);
            return next(err);
        } else {
            res.status(201).json();
        }
    });
});

// POST /api/courses/:courseId/reviews 201 - Creates a review for the specified course ID, 
// sets the Location header to the related course, and returns no content
router.post("/:courseId/reviews", mid.requiresLogin, (req,res,next) => {
    new Review(req.body)
    .save(function(err,review){
        if(err){
            res.status(400);
            return next(err);
        } else {
            res.location('/');
            res.status(201).json();
        }
    })
});


module.exports = router;