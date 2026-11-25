import express from 'express';
import questionRoute from './routes/question.js';
import mongoose from 'mongoose';

const app = express();
const PORT = 8080;
app.use(express.json());

app.use('/question', questionRoute);

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/chatbot-project');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

const connection = async () => {
  await connectDB();
};
connection()
  .then(() => console.log('MongoDB connect successfully!'))
  .catch((error) => console.log(error));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
