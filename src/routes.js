import { login, signUp } from './controller/account.js';
import { getAllData } from './controller/home.js';
import { getAllBooks, getFilteredBooks, updateRentedBooks, getSearchedBooks, getBook } from './controller/books.js';
import { Router } from 'express';
export const root = Router();
root.get('/', getAllData);

export const account = Router();

account.get('/login', (req, res) => {
    if (req.signedCookies.userEmail) {
        res.redirect('/');
    } else {
        res.render('login', {});
    }
});

account.post('/login', login);
account.post('/signup', signUp);

export const books = Router();
books.get('/allbooks', getAllBooks);
books.get('/filter', getFilteredBooks);
books.post('/checkoutcart', updateRentedBooks);
books.get('/search', getSearchedBooks);
books.get('/:bookID', getBook);
