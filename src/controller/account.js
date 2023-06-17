import { getUserByEmailAndPassword, checkIfEmailExists, createAccount } from '../module/account.js';
import { CustomError } from '../helpers/customErrors.js';
export async function login(req, res) {
    try {
        if (req.signedCookies.userEmail) {
            return res.status(401).send({ message: 'Already logged in.' });
        }

        const { emailID, password } = req.body;
        const account = await getUserByEmailAndPassword(emailID, password);

        // https://paul-senon.medium.com/node-express-js-cookies-set-get-secure-884311606148
        const cookieConfig = { httpOnly: true, maxAge: 1000000, signed: true };
        res.cookie('userEmail', account.emailID, cookieConfig);
        res.redirect('/');
    } catch (error) {
        // console.log(error);
        if (error instanceof CustomError) res.status(error.statusCode).send(`${error.message}`);
        else res.status(400).send('An unknown error occurred');
    }
}
export async function signUp(req, res) {
    try {
        const body = req.body;
        // console.log(body);
        const response = await checkIfEmailExists(body?.emailID);

        if (response === true) {
            return res
                .status(409)
                .send({ message: 'The email address is already associated with an existing account.' });
        }
        const account = await createAccount(body);
        res.send(account);
    } catch (error) {
        // console.log(error);
        if (error instanceof CustomError) res.status(error.statusCode).send(`${error.message}`);
        else res.status(400).send('An unknown error occurred');
    }
}
