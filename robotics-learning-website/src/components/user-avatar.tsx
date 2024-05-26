import { Session } from "next-auth"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import { LoginBtn } from "./login-btn"

export async function UserAvatar({ session }: { session: Session|null} ) {
    if (!session || !session.user) return <LoginBtn></LoginBtn>

    return (
        <Avatar>
            <AvatarImage src={session.user.image ?? "https://source.boringavatars.com/marble/120"}
            alt={session.user.name ?? ""} />
        </Avatar>
    )
}