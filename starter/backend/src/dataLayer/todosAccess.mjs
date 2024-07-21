import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand
} from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient()
const docClient = DynamoDBDocumentClient.from(client)

export class TodosAccess {
  constructor() {
    this.todosTable = process.env.TODOS_TABLE
    this.indexName = process.env.TODOS_CREATED_AT_INDEX
  }

  async getTodosForUser(userId) {
    const result = await docClient.send(
      new QueryCommand({
        TableName: this.todosTable,
        IndexName: this.indexName,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
    )

    return result.Items
  }

  async createTodo(todo) {
    await docClient.send(
      new PutCommand({
        TableName: this.todosTable,
        Item: todo
      })
    )
    return todo
  }

  async updateTodo(todo) {
    const { userId, todoId, name, dueDate, done } = todo
    await docClient.send(
      new UpdateCommand({
        TableName: this.todosTable,
        Key: {
          userId,
          todoId
        },
        UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeNames: {
          '#name': 'name'
        },
        ExpressionAttributeValues: {
          ':name': name,
          ':dueDate': dueDate,
          ':done': done
        }
      })
    )
  }

  async updateTodoAttachmentUrl(userId, todoId, attachmentUrl) {
    await docClient.send(
      new UpdateCommand({
        TableName: this.todosTable,
        Key: {
          userId,
          todoId
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': attachmentUrl
        }
      })
    )
  }

  async deleteTodo(todo) {
    const { userId, todoId } = todo
    await docClient.send(
      new DeleteCommand({
        TableName: this.todosTable,
        Key: {
          userId,
          todoId
        }
      })
    )
  }
}
