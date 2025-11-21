import express from 'express';
import { Category, Todo } from '../models/index';

const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     description: Retrieve a list of all available categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Successfully retrieved categories
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Category'
 *             examples:
 *               success:
 *                 summary: Example response
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: 1
 *                       name: "Work"
 *                       color: "#3B82F6"
 *                       created_at: "2024-01-15T10:00:00.000Z"
 *                     - id: 2
 *                       name: "Personal"
 *                       color: "#10B981"
 *                       created_at: "2024-01-15T10:00:00.000Z"
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['created_at', 'ASC']]
    });
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    });
  }
});

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     description: Create a new category with a unique name
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Urgent"
 *                 description: "Category name (must be unique)"
 *               color:
 *                 type: string
 *                 example: "#FF0000"
 *                 default: "#3B82F6"
 *                 description: "Color in hex format"
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Category'
 *       400:
 *         description: Validation error or duplicate category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingName:
 *                 summary: Name is required
 *                 value:
 *                   success: false
 *                   error: "Category name is required"
 *               duplicate:
 *                 summary: Duplicate category
 *                 value:
 *                   success: false
 *                   error: "Category name already exists"
 *       500:
 *         description: Internal server error
 */
router.post('/', async (req, res) => {
  try {
    const { name, color } = req.body;

    // Validate required fields
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Category name is required'
      });
    }

    // Validate color format if provided
    if (color && !/^#[0-9A-F]{6}$/i.test(color)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid color format. Use hex format like #3B82F6'
      });
    }

    const category = await Category.create({
      name: name.trim(),
      color: color || '#3B82F6'
    });

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error: any) {
    console.error('Error creating category:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        error: 'Category name already exists'
      });
    }
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        error: error.errors[0]?.message || 'Validation error'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to create category'
    });
  }
});

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category
 *     description: Update an existing category's name and/or color
 *     tags: [Categories]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Work & Projects"
 *               color:
 *                 type: string
 *                 example: "#0000FF"
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
// Di PUT /api/categories/:id - perbaiki validation
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    // Validate ID - sederhanakan
    const categoryId = parseInt(id);
    if (isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid category ID'
      });
    }

    const category = await Category.findByPk(categoryId);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Sederhanakan color validation
    if (color && !/^#([A-Fa-f0-9]{6})$/.test(color)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid color format'
      });
    }

    await category.update({
      name: name || category.name,
      color: color || category.color
    });

    res.json({
      success: true,
      data: category
    });
  } catch (error: any) {
    console.error('Error updating category:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        error: 'Category name already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to update category'
    });
  }
});

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     description: |
 *       Delete a category by ID. 
 *       Note: Todos associated with this category will have their category_id set to NULL.
 *     tags: [Categories]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             examples:
 *               success:
 *                 summary: Delete success
 *                 value:
 *                   success: true
 *                   message: "Category deleted successfully"
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    const categoryId = parseInt(id);
    if (isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid category ID'
      });
    }

    const category = await Category.findByPk(categoryId);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    await category.destroy();

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete category with associated todos'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to delete category'
    });
  }
});

export default router;