import authConfig from "@/auth.config"
import NextAuth from "next-auth"
import { SignIn } from "@/components/sign-in"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"

export async function UserAvatar() {
    const session = await NextAuth(authConfig).auth()

    if (!session?.user) return <SignIn></SignIn>

    return (
        <Avatar>
            <AvatarImage src={session.user.image ?? "https://source.boringavatars.com/marble/120"}
            alt={session.user.name ?? ""} />
        </Avatar>
    )
}