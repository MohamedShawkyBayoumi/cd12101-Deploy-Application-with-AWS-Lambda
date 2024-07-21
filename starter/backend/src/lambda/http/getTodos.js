import { getTodosForUser } from '../../businessLogic/todos.mjs'

export async function handler(event) {
  const jwtToken = event.headers.Authorization.split(' ')[1]

  const todos = await getTodosForUser(jwtToken)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items: todos
    })
  }
}
