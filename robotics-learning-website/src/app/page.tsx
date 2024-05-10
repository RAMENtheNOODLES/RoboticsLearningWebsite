'use client'
import Image from "next/image";
import { Database } from "./utils/database"

//const db = new Database();

function AddTestUserBtn() {
  function handleClick() {
    //alert("You clicked me!");
    fetch("/api/database_api", {
      method: "POST",
      headers: {
        'Accept': "application/json",
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        test: 'test'
      })
    }).then((r) => {
      if (r.ok)
        r.json().then((data?: any, e?: Error) => {
          if (data)
            alert(data["message"])
        })
    })
  }

  return (
    <button onClick={handleClick} >
      click me
    </button>
  )
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1>Hello world</h1>
        <p>User 1:</p>
        <AddTestUserBtn/>
      </div>
    </main>
  );
}
