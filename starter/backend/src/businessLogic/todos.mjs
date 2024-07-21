import { TodosAccess } from '../dataLayer/todosAccess.mjs'
import { AttachmentUtils } from '../fileStorage/attachmentUtils.mjs'
import { v4 as uuidv4 } from 'uuid'
import { parseUserId } from '../auth/utils.mjs'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  QueryCommand,
  UpdateCommand,
  DynamoDBDocumentClient
} from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({ region: 'us-east-1' })
const docClient = DynamoDBDocumentClient.from(client)
const todosTable = process.env.TODOS_TABLE

const todosAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()

export async function getTodosForUser(jwtToken) {
  const userId = parseUserId(jwtToken)

  const command = new QueryCommand({
    TableName: todosTable,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  })

  const result = await docClient.send(command)

  return result.Items
}

export async function createTodo(newTodo, jwtToken) {
  const todoId = uuidv4()
  const userId = parseUserId(jwtToken)

  return await todosAccess.createTodo({
    userId,
    todoId,
    createdAt: new Date().toISOString(),
    ...newTodo,
    done: false
  })
}

export async function updateTodo(todoId, updatedTodo, jwtToken) {
  const userId = parseUserId(jwtToken)
  return await todosAccess.updateTodo({
    userId,
    todoId,
    ...updatedTodo
  })
}

export async function deleteTodo(todoId, jwtToken) {
  const userId = parseUserId(jwtToken)
  return await todosAccess.deleteTodo({
    userId,
    todoId
  })
}

export async function generateUploadUrl(todoId) {
  return await attachmentUtils.generateUploadUrl(todoId)
}

export async function updateTodoAttachmentUrl(todoId, attachmentUrl, jwtToken) {
  const userId = parseUserId(jwtToken)

  const command = new UpdateCommand({
    TableName: todosTable,
    Key: {
      userId,
      todoId
    },
    UpdateExpression: 'set attachmentUrl = :attachmentUrl',
    ExpressionAttributeValues: {
      ':attachmentUrl': attachmentUrl
    }
  })

  await docClient.send(command)
}
