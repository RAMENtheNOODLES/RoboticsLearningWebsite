import { SignOut } from "@/app/components/sign-out-btn";
import { UserAvatar } from "../../components/user-avatar";
import { auth } from "@/auth";


export async function Navbar() {
    const session = await auth();

    const debug = JSON.stringify(session, null, 4)
    return (
        <div className="z-10 m-5 justify-between font-mono text-sm lg:flex align-middle">
            <SignOut></SignOut>
            <div className="object-right">
                <UserAvatar session={session} />
            </div>
            
        </div>
    )
}