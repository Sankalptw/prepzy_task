import { Router } from 'express';
import { addQuestion, startQuiz, submitQuiz, getQuizHistory, getStats } from '../controllers/quizController';
import { authenticate } from '../middleware/auth'; // Import this

const router = Router();

router.post('/questions', addQuestion);
router.get('/start/:topicSlug', startQuiz);
router.post('/submit', authenticate, submitQuiz);      // Add authenticate here
router.get('/history', authenticate, getQuizHistory);  // Add authenticate here
router.get('/stats', authenticate, getStats);          // Add authenticate here

export default router;