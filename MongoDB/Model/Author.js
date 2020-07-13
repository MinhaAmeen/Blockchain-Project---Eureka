module.exports = mongoose => {
    const Author = mongoose.model(
      "author",
      mongoose.Schema(
        {
            paperURL: String,
            amount: String,
            numberofRef : String,
            address: String,
            userID : String,
            status : String
           
        }
      )
    );
  
    return Author;
  };