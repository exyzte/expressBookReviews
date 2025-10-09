const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


//Register route 
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
    if(!isValid(username) || !password) {
        return res.status(400).json({ message: "Please provide a valid username and password." });
    }
  const exists = users.filter((user)=>{
    return user.username === username;
  });
  if (exists.length === 0) {
    users.push({ "username": username, "password": password })
    return res.status(200).json({ message: `User ${username} registered successfully` })
  }  else {
    res.status(302).json({ message: "User already exists" })
}
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.status(200).json(book);
    } else {
        res.status(404).json({ message: `Book with isbn: ${isbn} not found` })
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksArray = Object.values(books);
  const match = booksArray.filter((book)=>{
    return book.author === author;
  });
  if (match.length > 0) {
    return res.status(200).json(match);
  } else {
    return res.status(404).json({ message: `Book with author: ${author} not found.` })
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksArray = Object.values(books);
  const match = booksArray.filter((book)=>{
    return book.title === title;
  });
    if (match.length > 0) {
        return res.status(200).json(match);
    } else {
        return res.status(404).json({ message: `Book with title ${title} not found` });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
  return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: `Boog with isbn ${isbn} cannot be found.` })
  }
});

module.exports.general = public_users;
