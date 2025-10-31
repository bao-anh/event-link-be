import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import timeout from 'connect-timeout';
import todosRouter from './routes/todos';
import { errorHandler } from './middleware/errorHandler';
import parseJsonBody from './middleware/parseJsonBody';

const app = express();

app.use(cors());
app.use(express.json());
app.use(parseJsonBody);
app.use(express.urlencoded({ extended: true }));

// Per-request timeout (30s)
app.use(timeout('30s'));

// Todo routes (uses dedicated router)
app.use('/todos', todosRouter);


// Health check route
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Health check route
app.get('/', (req, res) => res.json({ status: 'ok', message: 'Welcome to Event Link API' }));

// Error handler (last)
app.use(errorHandler);

const port = process.env.PORT || 3000;

if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

export { app };
