import { readJSONfile, writeJSONfile } from '../../utils/data.js';

// Get all questions and answer - http:/localhost:8080/question/
export const getAllQuestions = async (req, res) => {
  try {
    const readFile = await readJSONfile('./json/questions.json');
    const questions = JSON.parse(readFile);

    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add a new question and answer - http:/localhost:8080/question/addQuestion
export const addQuestion = async (req, res) => {
  try {
    const readFile = await readJSONfile('./json/questions.json');
    const questions = JSON.parse(readFile);

    const { question_cn, answer_cn, question_en, answer_en } = req.body;

    const lastId =
      questions.length > 0
        ? Math.max(...questions.map((q) => Number(q.id)))
        : 0;

    const newQuestion = {
      id: lastId + 1,
      question_cn,
      answer_cn,
      question_en,
      answer_en,
    };

    if (
      !newQuestion.question_cn ||
      !newQuestion.answer_cn ||
      !newQuestion.question_en ||
      !newQuestion.answer_en
    ) {
      return res.status(404).json({
        success: false,
        message: 'keyword not found.',
      });
    }
    questions.push(newQuestion);
    await writeJSONfile('./json/questions.json', JSON.stringify(questions));
    res.status(201).json({
      success: true,
      message: 'Question and answer are added successfully!',
      data: newQuestion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get the question by keyword - http:/localhost:8080/question/:keyword
export const getQuestion = async (req, res) => {
  try {
    const readFile = await readJSONfile('./json/questions.json');
    const questions = JSON.parse(readFile);

    const { keyword } = req.params;

    const matchKeyword = questions.find(
      (match) =>
        match.question_cn.includes(keyword.trim()) ||
        match.question_en.includes(keyword.trim().toLowerCase()) ||
        match.answer_cn.includes(keyword.trim()) ||
        match.answer_en.includes(keyword.trim().toLowerCase()),
    );

    // console.log(Boolean(matchKeyword));

    if (!matchKeyword) {
      return res.status(400).json({
        success: false,
        message: 'Keyword is required.',
      });
    }

    const filteredQuestions = questions.filter(
      (q) =>
        q.question_en.toLowerCase().includes(keyword.toLowerCase()) ||
        q.question_cn.includes(keyword) ||
        q.answer_en.toLowerCase().includes(keyword.toLowerCase()) ||
        q.answer_cn.includes(keyword),
    );

    res.status(200).json({
      success: true,
      data: filteredQuestions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Edit question and answer by id - http:/localhost:8080/question/edit/:id
export const editQuestion = async (req, res) => {
  try {
    const readFile = await readJSONfile('./json/questions.json');
    const questions = JSON.parse(readFile);

    const questionIdx = questions.findIndex((q) => q.id == req.params.id);

    const updatedQuestion = req.body;

    if (questionIdx == -1) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }
    questions[questionIdx] = updatedQuestion;
    await writeJSONfile('./json/questions.json', JSON.stringify(questions));
    res.status(201).json({
      success: true,
      message: 'Edited question successfully!',
      data: updatedQuestion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete question and answer by id - http:/localhost:8080/question/delete/:id
export const deleteQuestion = async (req, res) => {
  try {
    const readFile = await readJSONfile('./json/questions.json');
    const questions = JSON.parse(readFile);

    const questionIdx = questions.findIndex((q) => q.id == req.params.id);

    if (questionIdx == -1) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }
    questions.splice(questionIdx, 1);
    await writeJSONfile('./json/questions.json', JSON.stringify(questions));
    res.status(200).json({
      success: true,
      message: 'Deleted question successfully!',
      data: questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
