import express from 'express';
import {
  getAllQuestions,
  getQuestion,
  addQuestion,
  editQuestion,
  deleteQuestion,
} from '../controllers/question/question.js';

const router = express.Router();

router.get('/', getAllQuestions);

router.get('/:keyword', getQuestion);

router.post('/addQuestion', addQuestion);

router.put('/edit/:id', editQuestion);

router.delete('/delete/:id', deleteQuestion);

export default router;
