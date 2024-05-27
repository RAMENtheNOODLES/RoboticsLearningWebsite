import {school_class, user} from "../lib/structures";

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    </main>
  )
}
