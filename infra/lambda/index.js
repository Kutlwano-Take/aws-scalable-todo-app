const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME || 'todo-app-tasks';  // Fallback for debugging

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
};

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));  // Log incoming request

  const httpMethod = event.httpMethod;
  const path = event.path;

  try {
    // Handle OPTIONS for CORS preflight
    if (httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: ''
      };
    }

    if (path === '/todos') {
      if (httpMethod === 'GET') {
        const params = { TableName: TABLE_NAME };
        const data = await dynamoDb.scan(params).promise();
        return {
          statusCode: 200,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          },
          body: JSON.stringify(data.Items || [])
        };
      }

      if (httpMethod === 'POST') {
        const body = JSON.parse(event.body || '{}');
        if (!body.text) {
          return { 
            statusCode: 400, 
            headers: corsHeaders,
            body: JSON.stringify({ message: "Missing text" }) 
          };
        }
        const params = {
          TableName: TABLE_NAME,
          Item: {
            id: Date.now().toString(),
            text: body.text,
            completed: body.completed || false,
            createdAt: new Date().toISOString()
          }
        };
        await dynamoDb.put(params).promise();
        return {
          statusCode: 201,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          },
          body: JSON.stringify(params.Item)
        };
      }
    }

    // Handle /todos/{id}/toggle - Toggle task completion
    const toggleMatch = path.match(/^\/todos\/([^\/]+)\/toggle$/);
    if (toggleMatch && httpMethod === 'PUT') {
      const taskId = toggleMatch[1];
      
      // First, get the current task to toggle its state
      const getParams = {
        TableName: TABLE_NAME,
        Key: { id: taskId }
      };
      const currentTask = await dynamoDb.get(getParams).promise();
      
      if (!currentTask.Item) {
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({ message: "Task not found" })
        };
      }

      // Toggle the completed status
      const newCompleted = !currentTask.Item.completed;
      const updateParams = {
        TableName: TABLE_NAME,
        Key: { id: taskId },
        UpdateExpression: 'SET completed = :completed',
        ExpressionAttributeValues: {
          ':completed': newCompleted
        },
        ReturnValues: 'ALL_NEW'
      };
      
      const result = await dynamoDb.update(updateParams).promise();
      return {
        statusCode: 200,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        },
        body: JSON.stringify(result.Attributes)
      };
    }

    // Handle /todos/{id} - Delete task
    const deleteMatch = path.match(/^\/todos\/([^\/]+)$/);
    if (deleteMatch && httpMethod === 'DELETE') {
      const taskId = deleteMatch[1];
      
      const deleteParams = {
        TableName: TABLE_NAME,
        Key: { id: taskId }
      };
      
      await dynamoDb.delete(deleteParams).promise();
      return {
        statusCode: 200,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        },
        body: JSON.stringify({ message: "Task deleted", id: taskId })
      };
    }

    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Invalid request", path, method: httpMethod })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Internal Server Error", error: error.message })
    };
  }
};
