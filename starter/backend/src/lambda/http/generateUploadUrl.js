import { generateUploadUrl } from '../../businessLogic/todos.mjs'
import { updateTodoAttachmentUrl } from '../../businessLogic/todos.mjs'

export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const url = await generateUploadUrl(todoId)

  const jwtToken = event.headers.Authorization.split(' ')[1]
  await updateTodoAttachmentUrl(todoId, url.split('?')[0], jwtToken)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: url
    })
  }
}
