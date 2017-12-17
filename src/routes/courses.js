"use-strict";

const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Course = require("../models/course");
const Review = require("../models/review");

// GET /api/courses 200 - Returns the Course "_id" and "title" properties

// GET /api/course/:courseId 200 - Returns all Course properties and related 
// documents for the provided course ID
// use Mongoose population to load the related user and reviews documents.

// POST /api/courses 201 - Creates a course, sets the Location header, and returns no content

// PUT /api/courses/:courseId 204 - Updates a course and returns no content

// POST /api/courses/:courseId/reviews 201 - Creates a review for the specified course ID, 
// sets the Location header to the related course, and returns no content


module.exports = router;