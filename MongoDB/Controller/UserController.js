const db = require("../Model");
const User = db.users
const Review=db.reviews
const Author=db.authors
const nodemailer = require('nodemailer');

exports.postPaper=(req,res)=>
{

    const paper = new Author({
        paperURL: req.body.paperURL,
        amount : req.body.amount,
        numberofRef : req.body.numberofRef,
        address: req.body.address,
        userID : req.session.id,
        status : "Pending"
      });
    
     
      paper
        .save(paper)
        .then(paperData => {
            User.find( 
                {"Type": "Reviewer"},
            )
            .then(data => {
               

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: "dbtestingproject@gmail.com" ,
                        pass: 'test12344321'
                    }
                    });
                for (var i=0;i<data.length;i++) {
                    let fromMail = 'dbtestingproject@gmail.com';
                    let toMail = data[i].Email;
                    let subject = 'New Paper For Review';
                    let text = "A new paper has been recieved for Reviewing." + "<br> Paper ID : " + paperData._id + "<br>" + " AuthorID: " + paperData.userID; 
                    let mailOptions = {
                        from: fromMail,
                        to: toMail,
                        subject: subject,
                        text: text
                        };

                        transporter.sendMail(mailOptions, (error, response) => {
                            if (error) {
                                console.log(error);
                            }
                            console.log(response)
                            });


                }
                res.send("Paper Has Been Sent For Review.");
                   
                
            })
            .catch(err => {
              res.status(500).send({
                message:
                  err.message || "Some error occurred while retrieving Reviwer."
              });
            });
          
          
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the paper."
          });
        });


}

exports.postReview=(req,res)=>
{
    const review = new Review({
        paperID: req.body.paperID,
        review : req.body.review,
        userID : req.session.id,
      });
    
     
      review
        .save(review)
        .then(data => {
            User.find( 
                {"Type": "Editor"},
            )
            .then(data => {
               

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: "dbtestingproject@gmail.com" ,
                        pass: 'test12344321'
                    }
                    });
                for (var i=0;i<data.length;i++) {
                    let fromMail = 'dbtestingproject@gmail.com';
                    let toMail = data[i].Email;
                    let subject = 'New Paper For Acceptance';
                    let text = "A new paper has been recieved for Acceptance.";
                    let mailOptions = {
                        from: fromMail,
                        to: toMail,
                        subject: subject,
                        text: text
                        };

                        transporter.sendMail(mailOptions, (error, response) => {
                            if (error) {
                                console.log(error);
                            }
                            console.log(response)
                            });


                }
       

})
res.send("Review Added. Please Go Back.");
})
.catch(err => {
  res.status(500).send({
    message:
      err.message || "Some error occurred while creating the review."
  });
});

}


exports.loginUser=(req,res) =>
{
       if (!req.body.email) {
          res.status(400).send({ message: "User email can not be empty!" });
          return;
        }
     
       else if (!req.body.password) {
          res.status(400).send({ message: "User password can not be empty!" });
          return;
        }

        User.find(
            // Find documents matching any of these values
            {"$and":[
                {"Email": req.body.email},
                {"Password": req.body.password}
            ]}
        )
        .then(data => {
          if (!data)
            res.status(404).send({ message: "Not found user with email : "+  req.body.email });
          else
          {
              req.session.id=data[0]._id;
              if(data[0].Type=="Reviewer")
              {
                
                  res.redirect('/reviewer');

              }
              else if(data[0].Type=="Author")
              {
                  res.redirect('/author')
              }
              else
              {
                  res.redirect('/editor');
              }
        }
        })
        .catch(err => {
          res
            .status(500)
            .send({ message: "Error retrieving user with id=" + req.body.email });
        });
     

}

exports.createUser = (req, res) => {

    if (!req.body.fname) {
      res.status(400).send({ message: "User firstname can not be empty!" });
      return;
    }
    else if (!req.body.lname) {
        res.status(400).send({ message: "User lastname can not be empty!" });
        return;
      }
     else if (!req.body.email) {
        res.status(400).send({ message: "User email can not be empty!" });
        return;
      }
     else if (!req.body.password) {
        res.status(400).send({ message: "User password can not be empty!" });
        return;
      }
     else  if (!req.body.type) {
        res.status(400).send({ message: "User type can not be empty!" });
        return;
      }

  

    const user = new User({
      Fname: req.body.fname,
      Lname : req.body.lname,
      Email : req.body.email,
      Type : req.body.type,
      Password : req.body.password
    });
  
   
    user
      .save(user)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User."
        });
      });
  };



  
  exports.rejectPaperByID = (req, res) => {
    const id = req.params.id;
  
    Author.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found paper with id " + id });
        else
        {
            Author.updateOne(
                {"_id": id },
                {
                  
                  "$set": { "status": "Rejected"}
                }
             ).then(data=>
                {
                    console.log(data);
                    res.redirect('/editor');
                }
             )
             .catch(err => {
                res
                  .status(500)
                  .send({ message: "Error retrieving paper with id=" + id });
              });

        } 
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving paper with id=" + id });
      });
  };


  exports.acceptPaperByID = (req, res) => {
    const id = req.params.id;
  
    Author.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found paper with id " + id });
        else
        {
            Author.updateOne(
                {"_id": id },
                {
                  
                  "$set": { "status": "Accepted"}
                }
             ).then(data=>
                {
                    console.log(data);
                    res.redirect('/editor');
                }
             )
             .catch(err => {
                res
                  .status(500)
                  .send({ message: "Error retrieving paper with id=" + id });
              });

        } 
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving paper with id=" + id });
      });
  };