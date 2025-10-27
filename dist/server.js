import express from 'express';
import routes from './api/routes/index.js';
const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());
app.use('/v1', routes);
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
