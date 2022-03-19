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
    <div className="m-4">
      <h1 className="text-3xl">Users</h1>
      <table className="table table-compact mt-2">
        <thead>
          <tr>
            <th>No.</th>
            <th>name</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((user, index) => (
              <tr key={index}>
                <th>{index + 1} </th>
                <th>{user.name}</th>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="mt-2">
        {mutation.isLoading ? (
          <div>Processing...</div>
        ) : (
          <div>
            <input
              className="input input-sm input-bordered bg-white"
              value={userName}
              type="input"
              onChange={(e) => setUserName(e.target.value)}
            />
            <button
              className="btn ml-2 btn-primary btn-sm"
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
    </div>
  )
}

export default App
