import { signInWithGoogle } from "@/app/actions"

export function SignIn() {
    const handleSubmit = (event: any) => {
        event.preventDefault()
        signInWithGoogle()
    }

    return (
        <form
            action={handleSubmit}>
            <button type="submit">Sign in with Google</button>
        </form>
    )
}