// eslint-disable-next-line @typescript-eslint/no-var-requires
const { DynamoDBClient, CreateTableCommand, ListTablesCommand, DescribeTableCommand, PutItemCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({
  region: 'ap-southeast-1',
  endpoint: 'http://localhost:8000',
  credentials: {
    accessKeyId: 'myAccessKey',
    secretAccessKey: 'mySecretKey',
  },
});

async function waitForTableActive(tableName) {
  // Poll until table becomes ACTIVE before inserting sample rows.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { Table } = await client.send(new DescribeTableCommand({ TableName: tableName }));
    if (Table?.TableStatus === 'ACTIVE') {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

async function insertSampleTodos() {
  const now = new Date().toISOString();
  const todos = [
    {
      id: { S: 'sample-1' },
      title: { S: 'Learn English' },
      description: { S: 'This is a sample todo to help you get started.' },
      completed: { BOOL: false },
      createdAt: { S: now },
      updatedAt: { S: now },
    },
    {
      id: { S: 'sample-2' },
      title: { S: 'Create project boilerplate' },
      description: { S: 'Double-click to edit the title or toggle completion.' },
      completed: { BOOL: true },
      createdAt: { S: now },
      updatedAt: { S: now },
    },
  ];

  for (const item of todos) {
    await client.send(
      new PutItemCommand({
        TableName: 'todos',
        Item: item,
      }),
    );
  }

  console.log('Seeded initial todos.');
}

async function createTodosTable() {
  try {
    // First check if table exists
    const listResult = await client.send(new ListTablesCommand({}));
    if (listResult.TableNames?.includes('todos')) {
      console.log('Table "todos" already exists.');
      return;
    }

    // Create table if it doesn't exist
    const command = new CreateTableCommand({
      TableName: 'todos',
      AttributeDefinitions: [
        {
          AttributeName: 'id',
          AttributeType: 'S',
        },
      ],
      KeySchema: [
        {
          AttributeName: 'id',
          KeyType: 'HASH',
        },
      ],
      BillingMode: 'PAY_PER_REQUEST',
    });

    await client.send(command);
    console.log('Successfully created table "todos"');

    await waitForTableActive('todos');
    await insertSampleTodos();
  } catch (error) {
    console.error('Error creating table:', error);
    process.exit(1);
  }
}

createTodosTable();
