import lodash from 'lodash';
import { CustomError } from '../helpers/customErrors.js';
import { checkIfEmailExists } from '../module/account.js';
import { get_subjects } from '../module/subject.js';
import { get_categories } from '../module/category.js';
import { get_books } from '../module/books.js';

export async function getAllData(req, res) {
    try {
        const { emailID, page } = req.body;
        //page = req.query.page
        const isUser = true; //await checkIfEmailExists(emailID);
        if (!isUser) throw new CustomError('Your email does not exist please signup kindly', 401);
        let books = [];
        let lastEvaluatedKey = page;
        let subjects = await get_subjects(10);
        let categories = await get_categories(10);
        do {
            const response = await get_books(100, page);
            lastEvaluatedKey = response.paging;
            books = books.concat(response.books);
        } while (lastEvaluatedKey !== undefined && books.length < 2);
        books = lodash.orderBy(books, ['title'], ['asc']);
        //console.log(categories)
        res.render('index', {
            categories: categories,
            subjects: subjects,
            tags: ['popular', 'hindi', 'english'],
            books: books,
            paging: lastEvaluatedKey,
        });
    } catch (error) {
        // console.log(error);
        if (error instanceof CustomError) res.status(error.statusCode).send(`${error.message}`);
        else res.status(400).send('An unknown error occurred');
    }
}
