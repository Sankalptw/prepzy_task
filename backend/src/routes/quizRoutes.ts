import { Router } from 'express';
import { addQuestion, startQuiz, submitQuiz, getQuizHistory, getStats } from '../controllers/quizController';
import { authenticate } from '../middleware/auth'; 

const router = Router();

router.post('/questions', addQuestion);
router.get('/start/:topicSlug', startQuiz);
router.post('/submit', authenticate, submitQuiz);      
router.get('/history', authenticate, getQuizHistory);  
router.get('/stats', authenticate, getStats);         

export default router;