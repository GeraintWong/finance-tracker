import { NextResponse, NextRequest } from "next/server";
import { db } from "@/db/drizzle";
import { accounts } from "@/db/schema";
import { z } from 'zod'
import { getAuth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { get } from "http";
import { error } from "console";

export const GET = async (req: NextRequest) => {
    try {

        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        let filteredAccounts = await db.select().from(accounts).where(eq(accounts.userId, userId))

        return NextResponse.json({ accounts: filteredAccounts })
    } catch (error) {
        return new NextResponse("Internal Server Error", {
            status: 500,
        })
    }
}

const accountSchema = z.object({
    name: z.string().min(1),
    type: z.string().min(1),
    plaidId: z.string().optional(),
})

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        //const { userId } = getAuth(req);

        //For Postman Testing Only
        const userId = "user_2xBrb2BdCnrBLGAoTMyj7TgxQst"

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const validatedBody = accountSchema.parse(body)

        const newAccount = await db.insert(accounts).values({
            name: validatedBody.name,
            type: validatedBody.type,
            userId: userId,
            plaidId: validatedBody.plaidId,
        }).returning();

        return NextResponse.json({ accounts: newAccount[0] }, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 })
        }
        return new NextResponse("Internal Error", { status: 500 })
    }
}
