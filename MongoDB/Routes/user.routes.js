var express = require('express');
var router = express.Router();
const db = require("../Model");
const Review=db.reviews
const Author=db.authors

var UserController = require('../Controller/UserController');
const User = require('../Model/User');

router.post('/author',UserController.postPaper);

router.post('/review',UserController.postReview);


router.post('/addUser',UserController.createUser);

router.post('/login',UserController.loginUser);

router.get('/reviewer',function(req,res)
{
    if(!req.session.id)
    {
        res.redirect('/login');
    }
    else
    res.render('reviewer');

})

router.get('/accept/:id',UserController.acceptPaperByID);

router.get('/reject/:id',UserController.rejectPaperByID);
router.get('/author',function(req,res)
{
    
    if(!req.session.id)
    {
        res.redirect('/login');
    }
    else
    res.render('author');

})
router.get('/editor',function(req,res)
{
    
    if(!req.session.id)
    {
        res.redirect('/login');
    }
    else
    {
       Author.find()
      .then(data => {
           res.render('editor', {papers: data});
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving User."
        });
      });
  }
    
    
       
    // res.render('editor', {papers: papers});
    
})


router.get('/signup', function(req, res) {
    res.render('signup');
});
router.get('/login', function(req, res) {
    res.render('login');
});



module.exports = router;