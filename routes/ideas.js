const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');
//LOAD HELPER


module.exports = router;
// LOAD IDEA MODEL
require('../models/Idea');
const Idea = mongoose.model('Idea');

// ADD IDEAS FORM
router.get('/add', ensureAuthenticated, (req,res) => {
  console.log(req.url);
  res.render('./ideas/add');
});

// EDIT IDEAS
router.get('/edit/:id', ensureAuthenticated, (req,res) => {
  console.log(req.url);
  Idea.findOne({_id:req.params.id})
  .then(idea => {
    console.log(idea);
    if(idea.user != req.user.id){
      req.flash('error_msg', 'Not authorized to edit');
      res.redirect('/ideas');
    }else{
      res.render('ideas/edit' , {
        idea: idea
      });
    }
  });
});

//PROCESS FORM
router.post('/', ensureAuthenticated, (req,res) => {
  let errors = [];

  if(!req.body.title) {
    errors.push({text: 'Please add title!'});
  }
  if(!req.body.details) {
    errors.push({text: 'Please add some details!'});
  }
  if(errors.length > 0) {
    res.render('./ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  }else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user:req.user.id
    };
    new Idea(newUser)
        .save()
        .then(idea => {
          req.flash('success_msg', 'Video Idea Added');
          res.redirect('./ideas');
        });

  }
  console.log(req.body);
});

//EDIT FORM PROVESS
router.put('/:id', ensureAuthenticated, (req,res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    idea.title= req.body.title;
    idea.details= req.body.details;

    idea.save().then(idea => {
      req.flash('success_msg', 'Video Idea Updated');
      res.redirect('/ideas');
    });
  });
});

//DELETE IDEA
router.delete('/:id', ensureAuthenticated, (req,res) =>{
  Idea.remove({_id: req.params.id})
  .then(()=> {
    req.flash('success_msg', 'Video Idea Removed');
    res.redirect('/ideas');
  });
});

//IDEAS INDEX PAGE
router.get('/', ensureAuthenticated, (req, res) => {
  Idea.find({user:req.user.id}).sort({date:'desc'})
  .then(ideas => {
    res.render('ideas/index', {
      ideas: ideas
    });
  });
});

// IDEA COMMUNITY
router.get('/all', (req,res) => {
  Idea.find({}).sort({date:'desc'})
  .then(ideas => {
    res.render('ideas/index', {
      ideas: ideas
    });
  });
});