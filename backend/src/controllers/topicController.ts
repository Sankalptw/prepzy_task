import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database';


export const testCreateTopic = async (req: Request, res: Response) => {
  try {
    console.log('TEST: Received request body:', req.body);

    const topicId = uuidv4();
    const name = 'Test Topic';
    const slug = 'test-topic-' + Date.now();
    const description = 'This is a test topic';
    const icon = '📚';
    const difficulty = 'Beginner';

    console.log('TEST: About to insert:', { topicId, name, slug, description, icon, difficulty });

    const result = await query(
      `INSERT INTO topics (id, name, slug, description, icon, difficulty, is_active, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING *`,
      [topicId, name, slug, description, icon, difficulty, true]
    );

    console.log('TEST: Insert result:', result.rows);

    // Verify it was inserted
    const verify = await query(`SELECT * FROM topics WHERE id = $1`, [topicId]);
    console.log('TEST: Verification query:', verify.rows);

    res.status(201).json({
      success: true,
      message: 'Test insert successful',
      data: result.rows[0],
      verification: verify.rows[0],
    });
  } catch (error: any) {
    console.error('TEST ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Test failed',
      error: error.message,
      stack: error.stack,
    });
  }
};


export const createTopic = async (req: Request, res: Response) => {
  try {
    const { title, slug, description, icon, difficulty } = req.body;

    console.log('CREATE: Request body:', req.body);

    if (!title || !slug) {
      return res.status(400).json({
        success: false,
        message: 'title and slug are required',
      });
    }

    const topicId = uuidv4();

    console.log('CREATE: About to insert:', { topicId, title, slug, description, icon, difficulty });

    const result = await query(
      `INSERT INTO topics (id, name, slug, description, icon, difficulty, is_active, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING *`,
      [
        topicId,
        title,
        slug,
        description || '',
        icon || '📚',
        difficulty || 'Beginner',
        true,
      ]
    );

    console.log('CREATE: Insert successful:', result.rows);

    res.status(201).json({
      success: true,
      message: `Topic "${title}" created successfully`,
      topic: result.rows[0],
    });
  } catch (error: any) {
    console.error('CREATE ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create topic',
      error: error.message,
    });
  }
};