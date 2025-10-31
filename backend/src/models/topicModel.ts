import { query } from '../config/database';
import { Topic } from '../types';

/**
 * Get all active topics with question count
 */
export const getAllTopics = async (): Promise<Topic[]> => {
  const result = await query(`
    SELECT 
      t.id,
      t.name,
      t.slug,
      t.description,
      t.icon,
      t.difficulty,
      COALESCE(COUNT(q.id), 0)::integer as question_count,
      t.is_active,
      t.created_at
    FROM topics t
    LEFT JOIN questions q ON t.id = q.topic_id
    WHERE t.is_active = true
    GROUP BY t.id, t.name, t.slug, t.description, t.icon, t.difficulty, t.is_active, t.created_at
    ORDER BY t.created_at ASC
  `);

  return result.rows;
};

/**
 * Get single topic by slug
 */
export const getTopicBySlug = async (slug: string): Promise<Topic | null> => {
  const result = await query(`
    SELECT 
      t.id,
      t.name,
      t.slug,
      t.description,
      t.icon,
      t.difficulty,
      COALESCE(COUNT(q.id), 0)::integer as question_count,
      t.is_active,
      t.created_at
    FROM topics t
    LEFT JOIN questions q ON t.id = q.topic_id
    WHERE t.slug = $1 AND t.is_active = true
    GROUP BY t.id, t.name, t.slug, t.description, t.icon, t.difficulty, t.is_active, t.created_at
  `, [slug]);

  return result.rows[0] || null;
};

/**
 * Get topic by ID
 */
export const getTopicById = async (id: string): Promise<Topic | null> => {
  const result = await query(
    'SELECT * FROM topics WHERE id = $1',
    [id]
  );

  return result.rows[0] || null;
};

/**
 * Check if topic exists by slug
 */
export const topicExists = async (slug: string): Promise<boolean> => {
  const result = await query(
    'SELECT id FROM topics WHERE slug = $1 LIMIT 1',
    [slug]
  );

  return result.rows.length > 0;
};