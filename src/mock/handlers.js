import { rest } from "msw"

const resource = "/users"

const users = [
  {
    name: "foo",
  },
  {
    name: "bar",
  },
  {
    name: "baz",
  },
]

export const handlers = [
  rest.get(resource, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(users), ctx.delay(0))
  }),
  rest.post(resource, (req, res, ctx) => {
    const { payload } = req.body

    users.push({
      name: payload.name,
    })

    return res(ctx.status(200), ctx.json(users), ctx.delay(2000))
  }),
]
