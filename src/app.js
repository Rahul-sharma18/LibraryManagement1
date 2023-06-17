import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser'
import helmet from 'helmet';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
import { account, root, books } from './routes.js';
import { errorHandler, notFound } from './middlewares/errors.js';
import { logger } from './helpers/logger.js';

import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

dotenv.config();

const app = express();

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(express.static('./src'));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(
    morgan(
        '[:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms ":referrer" ":user-agent"',
        {
            stream: {
                write: (meta) => {
                    logger.info(meta);
                },
            },
            skip: (req, res) => (req.headers['user-agent'] || '').indexOf('ELB-HealthChecker') !== -1,
        },
    ),
);
app.use(helmet());
app.use(
    cors({
        exposedHeaders: ['Date'],
    }),
);
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);

app.use('/', root);
app.use('/account', account);
app.use('/books', books);

app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on ', process.env.PORT);
});
