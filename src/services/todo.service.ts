import { PutCommand, GetCommand, DeleteCommand, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, TODOS_TABLE } from '../config/dynamodb';
import { Todo, CreateTodoInput, UpdateTodoInput } from '../models/todo';
import { v4 as uuidv4 } from 'uuid';

export class TodoService {
  async createTodo(input: CreateTodoInput): Promise<Todo> {
    const timestamp = new Date().toISOString();
    const todo: Todo = {
      id: uuidv4(),
      title: input.title,
      description: input.description,
      completed: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await dynamoDb.send(new PutCommand({
      TableName: TODOS_TABLE,
      Item: todo,
    }));

    return todo;
  }

  async getTodo(id: string): Promise<Todo | null> {
    const result = await dynamoDb.send(new GetCommand({
      TableName: TODOS_TABLE,
      Key: { id },
    }));

    return result.Item as Todo || null;
  }

  async getAllTodos(): Promise<Todo[]> {
    const result = await dynamoDb.send(new ScanCommand({
      TableName: TODOS_TABLE,
    }));

    return (result.Items || []) as Todo[];
  }

  async updateTodo(id: string, input: UpdateTodoInput): Promise<Todo | null> {
    const timestamp = new Date().toISOString();

    const updateExpression = [];
    const expressionAttributeValues: Record<string, any> = {
      ':updatedAt': timestamp,
    };
    const expressionAttributeNames: Record<string, string> = {};

    if (input.title !== undefined) {
      updateExpression.push('#title = :title');
      expressionAttributeValues[':title'] = input.title;
      expressionAttributeNames['#title'] = 'title';
    }

    if (input.description !== undefined) {
      updateExpression.push('#description = :description');
      expressionAttributeValues[':description'] = input.description;
      expressionAttributeNames['#description'] = 'description';
    }

    if (input.completed !== undefined) {
      updateExpression.push('#completed = :completed');
      expressionAttributeValues[':completed'] = input.completed;
      expressionAttributeNames['#completed'] = 'completed';
    }

    updateExpression.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';

    const result = await dynamoDb.send(new UpdateCommand({
      TableName: TODOS_TABLE,
      Key: { id },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
      ReturnValues: 'ALL_NEW',
    }));

    return result.Attributes as Todo || null;
  }

  async deleteTodo(id: string): Promise<boolean> {
    await dynamoDb.send(new DeleteCommand({
      TableName: TODOS_TABLE,
      Key: { id },
    }));

    return true;
  }
}