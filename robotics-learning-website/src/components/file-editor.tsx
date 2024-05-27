import { auth } from "@/auth"


export default async function FileBrowser() {
    const session = await auth()

    if (!session)
        return <pre>Need to be logged in!</pre>
    
    return (
        <div>
            
        </div>
    )
}