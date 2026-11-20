import express from 'express';
import { Question } from '../../models/questionSchema.js';

const router = express.Router();

// Get all questions and answer - http:/localhost:8080/question/
router.get('/', async (req, res) => {
  try {
    const readAllData = await Question.find();

    res.status(200).json({
      success: true,
      data: readAllData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Add a new question and answer - http:/localhost:8080/question/add
router.post('/add', async (req, res) => {
  try {
    const { question_cn, answer_cn, question_en, answer_en } = req.body;

    if (!question_cn || !answer_cn || !question_en || !answer_en) {
      return res.status(400).json({
        success: false,
        message: 'Question and answer are required.',
      });
    }

    const existingQuestion = await Question.findOne({
      question_cn,
      answer_cn,
      question_en,
      answer_en,
    });

    if (existingQuestion) {
      return res.status(200).json({
        success: false,
        message: 'Matching question and answer already exist in MongoDB.',
      });
    }

    const readAllData = await Question.find({}, { id: 1 });
    const lastId =
      readAllData.length > 0
        ? Math.max(...readAllData.map((q) => Number(q.id) || 0))
        : 0;

    const newQuestion = await Question.create({
      id: lastId + 1,
      question_cn,
      answer_cn,
      question_en,
      answer_en,
    });

    return res.status(201).json({
      success: true,
      message: 'Question and answer are added successfully!',
      data: newQuestion,
    });
  } catch (error) {
    console.error('addQuestion error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add question.',
    });
  }
});

// Get the question by keyword - http:/localhost:8080/question/:keyword
router.get('/:keyword', async (req, res) => {
  try {
    const keyword = req.params.keyword.trim();

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: 'Keyword is required.',
      });
    }

    const searchResult = await Question.find({
      $or: [
        { question_cn: { $regex: keyword, $options: 'i' } },
        { question_en: { $regex: keyword, $options: 'i' } },
        { answer_cn: { $regex: keyword, $options: 'i' } },
        { answer_en: { $regex: keyword, $options: 'i' } },
      ],
    });

    if (searchResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No question found matching the keyword',
      });
    }

    return res.status(200).json({
      success: true,
      data: searchResult,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Edit question and answer by id - http:/localhost:8080/question/edit/:id
router.put('/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { question_cn, answer_cn, question_en, answer_en } = req.body;

    const updateQuestion = await Question.findById(id);
    if (!updateQuestion) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }
    updateQuestion.question_cn = question_cn || updateQuestion.question_cn;
    updateQuestion.answer_cn = answer_cn || updateQuestion.answer_cn;
    updateQuestion.question_en = question_en || updateQuestion.question_en;
    updateQuestion.answer_en = answer_en || updateQuestion.answer_en;

    await updateQuestion.save();
    res.status(201).json({
      success: true,
      message: 'Edited question successfully!',
      data: updateQuestion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete question and answer by id - http:/localhost:8080/question/delete/:id
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteQuestion = await Question.findByIdAndDelete(id);

    if (!deleteQuestion) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
