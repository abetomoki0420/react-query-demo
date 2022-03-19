import { useState } from "react"
import ky from "ky"
import { useQuery, useMutation } from "react-query"

function App({ client }) {
  const { isLoading, error, data } = useQuery("users", async () => {
    const res = await ky.get("http://localhost:3000/users")
    return res.json()
  })

  const [userName, setUserName] = useState("")

  const mutation = useMutation(
    async (v) => {
      await ky.post("http://localhost:3000/users", {
        json: {
          payload: {
            name: v.name,
          },
        },
      })
      setUserName("")
    },
    {
      onSuccess: () => {
        console.log("success")
        // Invalidate and refetch
        client.invalidateQueries("users")
      },
    }
  )

  if (isLoading) return "Loading..."

  if (error) return "An error has occurred"

  return (
    <>
      <h1>Users</h1>
      <ul>
        {data && data.map((user) => <li key={user.name}>{user.name}</li>)}
      </ul>
      <div>
        {mutation.isLoading ? (
          <div>Processing...</div>
        ) : (
          <div>
            <input
              value={userName}
              type="input"
              onChange={(e) => setUserName(e.target.value)}
            />
            <button
              onClick={() =>
                mutation.mutate({
                  name: userName,
                })
              }
            >
              register user
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default App
