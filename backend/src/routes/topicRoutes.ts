import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { query } from "../config/database";

const router = Router();

/** List all topics */
router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT id, name, slug, description, icon, difficulty, is_active, created_at 
       FROM topics 
       WHERE is_active = true 
       ORDER BY created_at ASC`
    );

    res.json({ 
      success: true, 
      count: result.rows.length, 
      topics: result.rows 
    });
  } catch (error: any) {
    console.error("Get topics error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch topics",
      error: error.message 
    });
  }
});

/** Get topic by slug */
router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    
    const result = await query(
      `SELECT id, name, slug, description, icon, difficulty, is_active, created_at 
       FROM topics 
       WHERE slug = $1 AND is_active = true`,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Topic not found" 
      });
    }

    res.json({ 
      success: true, 
      topic: result.rows[0] 
    });
  } catch (error: any) {
    console.error("Get topic error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch topic",
      error: error.message 
    });
  }
});

/** Create topic */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, slug, description, icon, difficulty } = req.body;

    // Validation
    if (!title || !slug) {
      return res.status(400).json({ 
        success: false, 
        message: "title and slug are required" 
      });
    }

    // Check if slug already exists
    const existing = await query(
      "SELECT id FROM topics WHERE slug = $1",
      [slug]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ 
        success: false, 
        message: "Topic with this slug already exists" 
      });
    }

    // Insert into database
    const topicId = uuidv4();
    const result = await query(
      `INSERT INTO topics (id, name, slug, description, icon, difficulty, is_active, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING id, name, slug, description, icon, difficulty, is_active, created_at`,
      [
        topicId,
        title,
        slug,
        description || "",
        icon || "📚",
        difficulty || "Beginner",
        true
      ]
    );

    res.status(201).json({ 
      success: true, 
      message: `Topic "${title}" created successfully`,
      topic: result.rows[0] 
    });
  } catch (error: any) {
    console.error("Create topic error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to create topic",
      error: error.message 
    });
  }
});

/** Update topic */
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, slug, description, icon, difficulty, is_active } = req.body;

    const result = await query(
      `UPDATE topics 
       SET name = COALESCE($1, name),
           slug = COALESCE($2, slug),
           description = COALESCE($3, description),
           icon = COALESCE($4, icon),
           difficulty = COALESCE($5, difficulty),
           is_active = COALESCE($6, is_active)
       WHERE id = $7
       RETURNING id, name, slug, description, icon, difficulty, is_active, created_at`,
      [title, slug, description, icon, difficulty, is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Topic not found" 
      });
    }

    res.json({ 
      success: true, 
      message: "Topic updated successfully",
      topic: result.rows[0] 
    });
  } catch (error: any) {
    console.error("Update topic error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update topic",
      error: error.message 
    });
  }
});

/** Delete topic (soft delete) */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      `UPDATE topics 
       SET is_active = false 
       WHERE id = $1 
       RETURNING id, name`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Topic not found" 
      });
    }

    res.json({ 
      success: true, 
      message: "Topic deleted successfully" 
    });
  } catch (error: any) {
    console.error("Delete topic error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete topic",
      error: error.message 
    });
  }
});

export default router;