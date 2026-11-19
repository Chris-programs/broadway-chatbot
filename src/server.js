import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import express from 'express';
import questionRoute from './routes/question.routes.js';
import mongoose from 'mongoose';

const app = express();
const PORT = 8080;
app.use(express.json());

app.use('/question', questionRoute);

const connectDB = async () => {
  try {
    // await mongoose.connect('mongodb://localhost:27017/chatbot-project');
    await mongoose.connect(
      'mongodb+srv://yyhchris1222_db_user:YRJO3j68lGQV8zzD@cluster0.xyaankc.mongodb.net/chatbot-project',
    );
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
