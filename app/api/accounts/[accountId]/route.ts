import { NextResponse, NextRequest } from "next/server";
import { db } from "@/db/drizzle";
import { accounts } from "@/db/schema";
import { z } from 'zod'
import { getAuth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";

export const DELETE = async (req: NextRequest, { params }: { params: { accountId: string } }) => {
    try {
        //const { userId } = getAuth(req);

        //For Postman Testing Only
        const userId = "user_2xBrb2BdCnrBLGAoTMyj7TgxQst"

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const awaitedParams = await params
        const accountsId = awaitedParams.accountId

        const deletedAccount = await db.delete(accounts).where(
            and(
                eq(accounts.userId, userId),
                eq(accounts.id, accountsId)
            )
        )
            .returning()

        if (deletedAccount === null) {
            return NextResponse.json({ error: "Account not found or unauthorized to delete" }, { status: 404 });
        }

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Error during DELETE operation:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

const accountSchema = z.object({
    name: z.string().min(1),
    type: z.string().min(1),
})

export const PATCH = async (req: NextRequest, { params }: { params: { accountId: string } }) => {
    try {
        const body = await req.json()
        // const { userId } = getAuth(req)

        //For Postman Testing Only
        const userId = "user_2xBrb2BdCnrBLGAoTMyj7TgxQst"

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const awaitedParams = await params
        const accountsId = awaitedParams.accountId
        const validatedBody = accountSchema.partial().parse(body)

        const updatedAccount = await db.update(accounts)
            .set(validatedBody)
            .where(
                and(
                    eq(accounts.userId, userId),
                    eq(accounts.id, accountsId)
                )
            )

        return NextResponse.json(
            { message: "Account updated successfully", data: updatedAccount },
            { status: 200 }
        );

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}