module.exports = mongoose => {
    const User = mongoose.model(
      "user",
      mongoose.Schema(
        {
            Fname: String,
            Lname: String,
            Password : String,
            Email : String,
            Type : String,
           
        }
      )
    );
  
    return User;
  };