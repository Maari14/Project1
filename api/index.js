const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5055;


const Book = require('./models/book');


app.use(express.json())


app.use(bodyParser.json());

mongoose.connect('mongodb+srv://jala:jala@cluster0.bysodeo.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });
  
  db.once('open', () => {
    console.log('Connected to MongoDB');
    
  });






// Define your routes here

// Create a new book

app.post('/books', async (req, res) => {
    try {
      const { title, author, summary } = req.body;
  
      // Create a new user
      const newUser = new Book({
        title, author, summary
      });
  
      // Save the user to the database
      const savedUser = await newUser.save();
      console.log(savedUser)
      res.status(201).json(savedUser);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred.' });
    }
  });
  
// Get a list of all books
  app.get('/books', async (req, res) => {
    try {
      const books = await Book.find();
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({ error: 'Could not retrieve books.' });
    }
  });

  // Get details of a specific book by ID

  app.get('/books/:id', async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        res.status(404).json({ error: 'Book not found.' });
      } else {
        res.status(200).json(book);
      }
    } catch (error) {
      res.status(500).json({ error: 'Could not retrieve the book.' });
    }
  });

  // Update a book by ID

app.put('/books/:id', async (req, res) => {
    try {
      const bookId = req.params.id;
      const { title, author, summary } = req.body;
  
      // Find the book by its ID
      const book = await Book.findByIdAndUpdate(
        bookId,
        { title, author, summary },
        { new: true }
      );
  
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
  
      res.status(200).json(book);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred.' });
    }
  });
  
// Delete a book by ID
app.delete('/books/:id', async (req, res) => {
    try {
      const bookId = req.params.id;
  
      // Find and delete the book by its ID
      const deletedBook = await Book.findByIdAndRemove(bookId);
  
      if (!deletedBook) {
        return res.status(404).json({ error: 'Book not found' });
      }
  console.log("completed");
      res.status(200).json(deletedBook);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred.' });
    }
  });
  
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
