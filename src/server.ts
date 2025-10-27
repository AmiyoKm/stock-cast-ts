import cors from 'cors';
import express from 'express';
import { authenticate } from './api/middlewares/auth.ts';
import {
    errorHandler,
    notFound,
} from './api/middlewares/errorHandler.ts';
import { rateLimiter } from './api/middlewares/rateLimit.ts';
import routes from './api/routes/index.ts';

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(rateLimiter);
app.use(express.json());
app.use(authenticate)

app.use('/v1', routes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
