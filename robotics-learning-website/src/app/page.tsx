import {school_class, user} from "./utils/structures";
import { auth } from "@/auth";
import { LoginBtn } from "@/components/login-btn";
import { SignIn } from "@/components/sign-in";
import { UserAvatar } from "@/components/user-avatar";

//const db = new Database();

function GetUserBtn() {
  function handleClick() {
    //alert("You clicked me!");
    fetch("/api/users", {
      method: "GET",
      headers: {
        'Accept': "application/json",
        'Content-Type': "application/json"
      }
    }).then((r) => {
      if (r.ok)
        r.json().then((data?: any) => {
          if (data)
            alert(user.fromJSON(data["users"][0]))
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
    fetch("/api/classes", {
      method: "GET",
      headers: {
        'Accept': "application/json",
        'Content-Type': "application/json"
      }
    }).then((r) => {
      if (r.ok)
        r.json().then((data?: any) => {
          if (data)
            alert(school_class.fromJSON(data["classes"][0]))
        })
    })
  }

  return (
    <button onClick={handleClick} >
      Get all classes
    </button>
  )
}

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1>Hello world</h1>
        <p>User 1:</p>
        <LoginBtn/>

        <UserAvatar />
        <SignIn/>
      </div>
    </main>
  )
}
