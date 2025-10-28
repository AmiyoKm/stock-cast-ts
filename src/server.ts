import cors from 'cors';
import express from 'express';
import { authenticate } from './api/middlewares/auth.js';
import {
    errorHandler,
    notFound,
} from './api/middlewares/errorHandler.js';
import { rateLimiter } from './api/middlewares/rateLimit.js';
import routes from './api/routes/index.js';

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(rateLimiter);
app.use(express.json());
app.use(authenticate);
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use('/v1', routes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});