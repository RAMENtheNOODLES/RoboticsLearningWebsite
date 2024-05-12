import { FormEvent } from 'react'
import { useRouter } from 'next/router'
import '../src/app/globals.css'

export default function LoginPage() {
    const router = useRouter()

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const username = formData.get('username')
        const password = formData.get('password')

        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        })

        if (response.ok) {
            await router.push('/profile')
        } else {
            // Handle errors
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
                <form onSubmit={handleSubmit}>
                    <input type="text" name="username" placeholder="Username" required/>
                    <input type="password" name="password" placeholder="Password" required/>
                    <button type="submit">Login</button>
                </form>
            </div>

        </main>

    )
}