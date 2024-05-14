"use server"

import { cookies } from "next/headers";

export async function setCookie(name: string, value: string): Promise<void> {
    const cookieStore = cookies();

    cookieStore.set(name, value, {secure: true, httpOnly: true});
}