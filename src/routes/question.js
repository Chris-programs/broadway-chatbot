import express from 'express';
import { Question } from '../../models/questionSchema.js';

const router = express.Router();

// Get all questions and answer - http:/localhost:8080/question/
router.get('/', async (req, res) => {
  try {
    const dataList = await Question.find();

    if (dataList.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No question is found',
      });
    }

    res.status(200).json({
      success: true,
      data: dataList,
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

    const dataList = await Question.find({}, { id: 1 });

    const lastId =
      dataList.length > 0
        ? Math.max(...dataList.map((q) => Number(q.id) || 0))
        : 0;

    const newQuestion = new Question({
      id: lastId + 1,
      question_cn,
      answer_cn,
      question_en,
      answer_en,
    });

    await newQuestion.save();

    res.status(201).json({
      success: true,
      message: 'Question and answer are added successfully!',
      data: newQuestion,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get the question by keyword - http:/localhost:8080/question/:keyword
router.get('/:keyword', async (req, res) => {
  try {
    const keyword = req.params.keyword.trim();

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

    res.status(200).json({
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

    const updateQuestion = await Question.findByIdAndUpdate(
      id,
      { question_cn, answer_cn, question_en, answer_en },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updateQuestion) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

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
        message: 'Question not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully',
      data: deleteQuestion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
