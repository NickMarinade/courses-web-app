'use strict'

const fs = require('fs');
const path = require('path');
const Joi = require('joi');
const util = require("util"); 

const config = require('../config');
const DATA_DIR = path.join(__dirname, '/..', config.DATA_DIR, '/courses.json');

const readFilePromise = util.promisify(fs.readFile);
const writeFilePromise = util.promisify(fs.writeFile);

const controllers = {
  getCourses: async (req, res, next) => {
    try {
      const content = await readFilePromise(DATA_DIR, 'utf-8');
      res.send(JSON.parse(content));
    } catch (err) {
      if (err) {
        res.status(404).end();
      }
      if (err) {
        next(err);
      }
    }
  },

  postCourse: async (req, res, next) => {
    const { error } = validateCourse(req.body);
    if (error) res.status(400).end();
    
    try {
      const content = await readFilePromise(DATA_DIR, 'utf-8');
      const parsedContent = JSON.parse(content);
      const coursesData = parsedContent;
      const course = {
        id: coursesData.length + 1,
        name: req.body.name,
      };
      coursesData.push(course);
      const stringToSave = JSON.stringify(parsedContent, null, 1);
      await writeFilePromise(DATA_DIR, stringToSave, 'utf-8');
      res.send(course);
    } catch (err) {
      if (err) {
        res.status(404).end();
      }
      if (err) {
        next(err);
      }
    }
  },
  
  updCourse: async (req, res, next) => {
    const { error } = validateCourse(req.body);
    if (error) res.status(400).end();

    try {
      const content = await readFilePromise(DATA_DIR, 'utf-8');
      const parsedContent = JSON.parse(content);
      const course = parsedContent.find((c) => c.id === parseInt(req.params.id));

      if (!course) res.status(404).send("Not Found");
      course.name = req.body.name;
      const toString = JSON.stringify(parsedContent, null, 1);
      await writeFilePromise(DATA_DIR, toString, 'utf-8');
      res.send(course);
    } catch (err) {
      if (err) {
        res.status(404).end();
      }
      if (err) {
        next(err);
      }
    }
  },

  deleteCourse: async (req, res, next) => {

    try {
      const content = await readFilePromise(DATA_DIR, 'utf-8');
      const parsedContent = JSON.parse(content);
      const course = parsedContent.find((c) => c.id === parseInt(req.params.id));

      if (!course) res.status(404).send("Not Found");
      const index = parsedContent.indexOf(course);
      parsedContent.splice(index, 1);
      const toString = JSON.stringify(parsedContent, null, 1);
      await writeFilePromise(DATA_DIR, toString, 'utf-8');
      res.send('DELETED');
    } catch (err) {
      if (err) {
        res.status(404).end();
      }
      if (err) {
        next(err);
      }
    }
  }

  
};

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(course, schema);
};

module.exports = controllers;
