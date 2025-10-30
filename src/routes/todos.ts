
import { Router } from 'express';
import { TodoController } from '../controllers/todo.controller';

const router = Router();
const controller = new TodoController();

router.post('/', controller.createTodo);
router.get('/', controller.getAllTodos);
router.get('/:id', controller.getTodo);
router.put('/:id', controller.updateTodo);
router.delete('/:id', controller.deleteTodo);

export default router;
