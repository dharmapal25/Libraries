import React from 'react'

export default function App() {

  const [data, setData] = React.useState("");

  React.useEffect(() => {
    fetch('http://localhost:5000/api/data')   // ← localhost karo
      .then(response => response.json())
      .then(data => setData(data))
      .catch(err => console.error("API Error:", err))  // error handling bhi add karo
  }, []);

  return (
    <div>
      <h1>App page</h1>
      <h2>{data?.message}</h2>
    </div>
  )
}