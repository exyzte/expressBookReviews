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
public_users.get('/',async function (req, res) {
    try {
        const allBooks = await new Promise((resolve, reject) => {
            resolve(books);
        })
        return res.status(200).json(allBooks);
    } catch (error) {
        return res.status(500).json({ message: `Error fetching book list.` });
    }
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const bookMatch = await new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject("Book not found");
        }
        return res.status(200).json(book);
    })
  } catch (error) {
    res.status(404).json({ message: `Book with ISBN ${isbn} not found` })
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
    try {
        const bookByAuthor = await new Promise((resolve, reject)=> {
            const booksArray = Object.values(books);
            const match = booksArray.filter((book)=>{
                return book.author === author;
            })
            if (match.length > 0) {
                resolve(match);
            } else {
                reject(`No matches found for book from ${author}`);
            }
        })
        return res.status(200).json(match);
    } catch (error) {
        return res.status(404).json(error);
    }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  const title = req.params.title;
    
    try {
        const matchedBooks = await new Promise((resolve, reject) => {
        const booksArray = Object.values(books);
        const match = booksArray.filter((book) => {
            return book.title === title;
        })
        
        if (match.length > 0) {
            resolve(match);
        } else {
            reject(`No matches found for book ${title}`);
        }
  });
  req.status(200).json(matchedBooks);

} catch (error) {
    req.status(404).json({ message: error });
}  
});

//  Get book review
public_users.get('/review/:isbn',async function (req, res) {
  const isbn = req.params.isbn;
  
  if(!books[isbn]) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` })
  }
  
  const bookDetails = books[isbn];
    try {
        const bookReviews = await new Promise((resolve, reject) => {
            const reviewsObj = books[isbn].reviews;
            const reviewsArray = Object.entries(reviewsObj);
            const author = bookDetails.author;
            if(reviewsArray.length > 0) {
                resolve({
                    author: author,
                    reviews: reviewsArray
                });
            } else {
                reject({ message: `Book with ISBN ${isbn} doesn't have any existing reviews.`});
            }
    });
    return res.status(200).json(bookReviews);
    } catch(error) {
       return res.status(404).json(error);
    }
});

module.exports.general = public_users;
