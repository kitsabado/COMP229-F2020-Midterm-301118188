// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {

    //this allows the user to view the add page
    res.render('books/details', {title: 'Add Book', books:''})
});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {

    // this code block will allow the user to add a new book to the database and show it onto the book list
    let newBook = book({
      "title": req.body.title,
      "description": req.body.description,
      "price": req.body.price,
      "author": req.body.author,
      "genre": req.body.genre
    });

    book.create(newBook, (err, book) => {
      if(err)
      {
        console.log(err);
        res.end(err);
      }
      else
      {
        res.redirect('/books');
      }
    });
});

// GET the Book Details page in order to edit an existing Book
router.get('/:id', (req, res, next) => {

    //this gets the details of the book to be edited and be redirected to Edit Page
    let id = req.params.id;

    book.findById(id, (err, bookToEdit) => {
       if(err)
       {
          console.log(err);
          res.end(err);
       } 
       else
       {
          res.render('books/details', {title: 'Edit Book', books: bookToEdit})
       }
    });
});

// POST - process the information passed from the details form and update the document
router.post('/:id', (req, res, next) => {

    // this allows the changes and edits to be posted onto the existing book list inside the database
    let id = req.params.id

    let updatedBook = book({
      "_id": id,
      "title": req.body.title,
      "description": req.body.description,
      "price": req.body.price,
      "author": req.body.author,
      "genre": req.body.genre
    });

    book.updateOne({_id: id}, updatedBook, (err) => {
        if(err)
        {
          console.log(err);
          res.end(err);
        }
        else
        {
          res.redirect('/books');
        }
    })
});

// GET - process the delete by user id
router.get('/delete/:id', (req, res, next) => {

    // this will delete a book from the database
    let id = req.params.id;

    book.remove({_id: id}, (err) => {
      if(err)
      {
          console.log(err);
          res.end(err);
      }
      else
      {
          res.redirect('/books');
      }
    })
});


module.exports = router;
