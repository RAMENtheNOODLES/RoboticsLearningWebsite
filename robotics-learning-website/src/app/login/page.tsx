import "@/app/globals.css"
import { signIn, auth, providerMap } from "@/auth"

export default function LoginPage() {

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            {Object.values(providerMap).map((provider) => (
                <form
                    action={async () => {
                        "use server"
                        await signIn(provider.id)
                    }}

                    key={provider.name}
                >
                    <button type="submit">
                        <span>Sign in with {provider.name}</span>
                    </button>
                </form>
            ))}
        </main>
    )
}