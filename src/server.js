import express from 'express';
import questionRoute from './routes/question.routes.js';

const app = express();
const PORT = 8080;
app.use(express.json());

app.use('/question', questionRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
