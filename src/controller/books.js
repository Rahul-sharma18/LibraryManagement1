import lodash from 'lodash';
import { CustomError } from '../helpers/customErrors.js';
import { checkIfEmailExists } from '../module/account.js';
import { get_subjects } from '../module/subject.js';
import { get_categories } from '../module/category.js';
import { get_books, insert_book, getBookById } from '../module/books.js';
export async function getAllBooks(req, res) {
    try {
        const emailID = req.signedCookies.userEmail;
        const { lastBook } = req.body;
        if (!emailID) {
            return res.redirect('/account/login');
        }
        //const { emailID, page } = req.body;
        const page = req.query.page || 1;
        const isUser = await checkIfEmailExists(emailID);
        if (!isUser) throw new CustomError('Your email does not exist please signup kindly', 401);
        let books = [];
        let subjects = [];
        let categories = [];
        let lastEvaluatedKey = lastBook;

        do {
            const response = await get_books(100, lastBook);
            subjects = await get_subjects(100);
            categories = await get_categories(100);
            lastEvaluatedKey = response.paging;
            books = books.concat(response.books);
        } while (lastEvaluatedKey !== undefined && books.length < 2);
        books = lodash.orderBy(books, ['title'], ['asc']);
        // console.log(books);
        res.render('index', {
            subjects: subjects,
            categories: categories,
            tags: ['all', 'popular', 'hindi', 'english'],
            books: books,
            paging: lastEvaluatedKey,
        });
    } catch (error) {
        // console.log(error);
        if (error instanceof CustomError) res.status(error.statusCode).send(`${error.message}`);
        else res.status(400).send('An unknown error occurred');
    }
}

export async function getFilteredBooks(req, res) {
    try {
        const { lastBook } = req.body;
        res.send(lastBook);
    } catch (err) {
        res.send('Uer not found');
    }
}
export async function updateRentedBooks(req, res) {
    try {
        const body = req.body;
        res.send(body);
    } catch (err) {
        res.send('Uer not found');
    }
}
export async function getSearchedBooks(req, res) {
    try {
        const { lastBook } = req.body;
        const emailID = req.signedCookies.userEmail;
        if (!emailID) {
            return res.redirect('/account/login');
        }
        const page = req.query.page || 1;
        const isUser = await checkIfEmailExists(emailID);
        if (!isUser) throw new CustomError('Your email does not exist please signup', 401);
        let books = [];
        let subjects = [];
        let categories = [];
        let lastEvaluatedKey = lastBook;

        do {
            const response = await get_books(100, lastBook);
            subjects = await get_subjects(100);
            lastEvaluatedKey = response.paging;
            books = books.concat(response.books);
        } while (lastEvaluatedKey !== undefined && books.length < 2);
        books = lodash.orderBy(books, ['title'], ['asc']);
        res.render('books', {
            search_query: req.query.q,
            categories: categories,
            subjects: subjects,
            tags: ['all', 'popular', 'hindi', 'english'],
            books: books,
            paging: lastEvaluatedKey,
        });
    } catch (err) {
        res.send('Uer not found');
    }
}
export async function getBook(req, res) {
    try {
        // console.log(req.params.bookID);
        const bookID = req.params.bookID;
        const emailID = req.signedCookies.userEmail;
        if (!emailID) {
            return res.redirect('/account/login');
        }
        const isUser = await checkIfEmailExists(emailID);
        if (!isUser) throw new CustomError('Your email does not exist please signup', 401);
        let subjects = [];
        let categories = [];
        subjects = await get_subjects(100);
        const book = await getBookById(bookID);
        res.render('book', {
            categories: categories,
            subjects: subjects,
            book: book,
        });
    } catch (err) {
        //console.log(err);
        res.send('Uer not found');
    }
}
export async function addBook(req, res) {
    try {
        const body = req.body;
        const book = await insert_book(body);
        res.send(book);
    } catch (error) {
        // console.log(error);
        if (error instanceof CustomError) res.status(error.statusCode).send(`${error.message}`);
        else res.status(400).send('An unknown error occurred');
    }
}
