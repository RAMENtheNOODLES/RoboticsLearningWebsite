import "@/app/globals.css"
import { SignIn } from '@/components/sign-in'

export default function LoginPage() {

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <SignIn></SignIn>
        </main>
    )
}