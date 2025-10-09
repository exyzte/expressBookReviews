const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    if (!username || username.trim() === "") {
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=> {
        return (user.username === username && user.password === password);
    })
        return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(400).json({ message: "Username or password not provided" });
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: username
        }, 'access', { expiresIn: 60 * 60 });
        // store the token and username in the user's session
        req.session.authorization = {
            accessToken,
            username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(401).json({ message: "Invalid login. Check username & password" })
    }
        
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;

  if (!books[isbn]) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found,` });
  }
  if (!review) {
    return res.status(400).json({ message: "Review content is required in the request body." })
  }
  books[isbn].reviews[username] = review;

  return res.status(200).json({ 
    message: `Review for ISBN ${isbn} by user ${username} has been successfully added/updated-`,
    reviews: books[isbn].reviews
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
