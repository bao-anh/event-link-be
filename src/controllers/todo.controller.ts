import { Request, Response } from 'express';
import { TodoService } from '../services/todo.service';
import { CreateTodoInput, UpdateTodoInput } from '../models/todo';

const todoService = new TodoService();

export class TodoController {
  async createTodo(req: Request, res: Response): Promise<void> {
    try {
      const input: CreateTodoInput = req.body;
      const todo = await todoService.createTodo(input);
      res.status(201).json(todo);
    } catch (error) {
      res.status(500).json({ error: 'Could not create todo' });
    }
  }

  async getTodo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const todo = await todoService.getTodo(id);

      if (!todo) {
        res.status(404).json({ error: 'Todo not found' });
        return;
      }

      res.json(todo);
    } catch (error) {
      res.status(500).json({ error: 'Could not get todo' });
    }
  }

  async getAllTodos(req: Request, res: Response): Promise<void> {
    try {
      const todos = await todoService.getAllTodos();
      res.json(todos);
    } catch (error) {
      res.status(500).json({ error: 'Could not get todos' });
    }
  }

  async updateTodo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input: UpdateTodoInput = req.body;
      const todo = await todoService.updateTodo(id, input);

      if (!todo) {
        res.status(404).json({ error: 'Todo not found' });
        return;
      }

      res.json(todo);
    } catch (error) {
      res.status(500).json({ error: 'Could not update todo' });
    }
  }

  async deleteTodo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await todoService.deleteTodo(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Could not delete todo' });
    }
  }
}