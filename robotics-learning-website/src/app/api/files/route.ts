import { type NextRequest } from "next/server";
import { type Session } from "next-auth";
import { Database } from "@/lib/database";

export async function POST(request: NextRequest) {
    const db = new Database()
    const searchParams = request.nextUrl.searchParams;
    const { session }: { session: Session } = await request.json();
    
    if (!session || !session?.user)
        return Response.redirect(`/`, 501)

    return Response.json({ file_location: db.getFileLocation(Number(searchParams.get('id') ?? -1)) })
}