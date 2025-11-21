import express from 'express';
import { Op } from 'sequelize';
import { Todo, Category } from '../models/index';

const router = express.Router();

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Get all todos with pagination and filtering
 *     description: |
 *       Retrieve a paginated list of todos with optional filtering and search capabilities.
 *       
 *       ### Filtering Options:
 *       - **Search**: Case-insensitive search by title
 *       - **Status**: Filter by completion status
 *       - **Category**: Filter by category ID
 *       - **Priority**: Filter by priority level (low/medium/high)
 *       
 *       ### Priority Colors:
 *       - 🔴 High (red)
 *       - 🟡 Medium (yellow)  
 *       - 🟢 Low (green)
 *     tags: [Todos]
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *       - $ref: '#/components/parameters/CompletedParam'
 *       - $ref: '#/components/parameters/CategoryIdParam'
 *       - $ref: '#/components/parameters/PriorityParam'
 *     responses:
 *       200:
 *         description: Successfully retrieved todos
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
 *                         $ref: '#/components/schemas/Todo'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *             examples:
 *               success:
 *                 summary: Example response
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: 1
 *                       title: "Complete coding challenge"
 *                       description: "Build a full-stack todo application"
 *                       completed: false
 *                       category_id: 1
 *                       priority: "high"
 *                       due_date: "2024-08-03T23:59:59.000Z"
 *                       created_at: "2024-01-15T10:00:00.000Z"
 *                       updated_at: "2024-01-15T10:00:00.000Z"
 *                       category:
 *                         id: 1
 *                         name: "Work"
 *                         color: "#3B82F6"
 *                         created_at: "2024-01-15T10:00:00.000Z"
 *                   pagination:
 *                     current_page: 1
 *                     per_page: 10
 *                     total: 1
 *                     total_pages: 1
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', async (req, res) => {
  try {
    const {
      page = '1',
      limit = '10',
      search,
      completed,
      category_id,
      priority
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const where: any = {};
    
    if (search) {
      where.title = { [Op.iLike]: `%${search}%` };
    }
    
    if (completed !== undefined) {
      where.completed = completed === 'true';
    }
    
    if (category_id) {
      where.category_id = parseInt(category_id as string);
    }
    
    if (priority) {
      where.priority = priority;
    }

    const { count, rows } = await Todo.findAndCountAll({
      where,
      include: [Category],
      limit: limitNum,
      offset,
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        current_page: pageNum,
        per_page: limitNum,
        total: count,
        total_pages: Math.ceil(count / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Get a single todo by ID
 *     description: Retrieve detailed information about a specific todo including its category
 *     tags: [Todos]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Successfully retrieved todo
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               notFound:
 *                 summary: Todo not found
 *                 value:
 *                   success: false
 *                   error: "Todo not found"
 *       500:
 *         description: Internal server error
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByPk(id, { include: [Category] });

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }

    res.json({ success: true, data: todo });
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new todo
 *     description: Create a new todo item with the provided data
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Learn TypeScript"
 *                 description: "Todo title (required)"
 *               description:
 *                 type: string
 *                 example: "Study TypeScript fundamentals and advanced features"
 *                 description: "Todo description"
 *               category_id:
 *                 type: integer
 *                 example: 1
 *                 description: "Category ID reference"
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: high
 *                 default: medium
 *                 description: "Priority level"
 *               due_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-08-10T23:59:59.000Z"
 *                 description: "Due date in ISO format"
 *     responses:
 *       201:
 *         description: Todo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingTitle:
 *                 summary: Title is required
 *                 value:
 *                   success: false
 *                   error: "Title is required"
 *       500:
 *         description: Internal server error
 */
// Di POST /api/todos - sederhanakan validation
router.post('/', async (req, res) => {
  try {
    const { title, description, category_id, priority, due_date } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      });
    }

    const todo = await Todo.create({
      title: title.trim(),
      description: description?.trim(),
      category_id: category_id || null,
      priority: priority || 'medium',
      due_date: due_date ? new Date(due_date) : null
    });

    const createdTodo = await Todo.findByPk(todo.id, { 
      include: [Category] 
    });

    res.status(201).json({
      success: true,
      data: createdTodo
    });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});
/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Update a todo
 *     description: Update an existing todo with the provided data
 *     tags: [Todos]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated todo title"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *               completed:
 *                 type: boolean
 *                 example: true
 *               category_id:
 *                 type: integer
 *                 example: 2
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: medium
 *               due_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-08-15T23:59:59.000Z"
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category_id, priority, due_date, completed } = req.body;

    const todo = await Todo.findByPk(id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }

    await todo.update({
      title: title || todo.title,
      description: description !== undefined ? description : todo.description,
      category_id: category_id !== undefined ? category_id : todo.category_id,
      priority: priority || todo.priority,
      due_date: due_date !== undefined ? new Date(due_date) : todo.due_date,
      completed: completed !== undefined ? completed : todo.completed
    });

    const updatedTodo = await Todo.findByPk(id, { include: [Category] });

    res.json({
      success: true,
      data: updatedTodo
    });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/todos/{id}/toggle:
 *   patch:
 *     summary: Toggle todo completion status
 *     description: Toggle the completed status of a todo (true/false)
 *     tags: [Todos]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Todo status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByPk(id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }

    await todo.update({ completed: !todo.completed });

    res.json({
      success: true,
      data: todo
    });
  } catch (error) {
    console.error('Error toggling todo:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     description: Permanently delete a todo by ID
 *     tags: [Todos]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             examples:
 *               success:
 *                 summary: Delete success
 *                 value:
 *                   success: true
 *                   message: "Todo deleted successfully"
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByPk(id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }

    await todo.destroy();

    res.json({
      success: true,
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;