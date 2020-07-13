module.exports = mongoose => {
    const Review = mongoose.model(
      "review",
      mongoose.Schema(
        {
            paperID: String,
            userID: String,
            review : String,
           
        }
      )
    );
  
    return Review;
  };