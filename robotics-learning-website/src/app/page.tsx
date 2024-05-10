'use client'
import Image from "next/image";
import { Database } from "./utils/database"
import { user, school_class } from "./utils/structures";

//const db = new Database();

function GetUserBtn() {
  function handleClick() {
    //alert("You clicked me!");
    fetch("/api/users", {
      method: "POST",
      headers: {
        'Accept': "application/json",
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        userID: 1
      })
    }).then((r) => {
      if (r.ok)
        r.json().then((data?: any, e?: Error) => {
          if (data)
            alert(user.fromJSON(data["user"]))
        })
    })
  }

  return (
    <button onClick={handleClick} >
      Get user
    </button>
  )
}

function GetAllClassesBtn() {
  function handleClick() {
    //alert("You clicked me!");
    fetch("/api/get_all_classes", {
      method: "POST",
      headers: {
        'Accept': "application/json",
        'Content-Type': "application/json"
      }
    }).then((r) => {
      if (r.ok)
        r.json().then((data?: any, e?: Error) => {
          if (data)
            alert(data["class"][0].toString())
        })
    })
  }

  return (
    <button onClick={handleClick} >
      Get all classes
    </button>
  )
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1>Hello world</h1>
        <p>User 1:</p>
        <GetUserBtn />
        <GetAllClassesBtn/>
      </div>
    </main>
  );
}
