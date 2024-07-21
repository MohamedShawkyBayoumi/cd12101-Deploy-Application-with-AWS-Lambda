import { createTodo } from '../../businessLogic/todos.mjs'

export async function handler(event) {
  const newTodo = JSON.parse(event.body)
  const jwtToken = event.headers.Authorization.split(' ')[1]

  const item = await createTodo(newTodo, jwtToken)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item
    })
  }
}
