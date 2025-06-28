import { NextResponse, NextRequest } from "next/server";
import { db } from "@/db/drizzle";
import { transactions } from "@/db/schema";
import { z } from 'zod'
import { getAuth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { transactionTypeEnum, transactionCategoryEnum } from "../../../db/schema";
import { error } from "console";

export const transactionSchema = z.object({
    name: z.string().min(1, { message: "Transaction name is required." }),
    amount: z.coerce.number().positive({ message: "Amount must be a positive number." }),
    date: z.string().transform((str) => new Date(str)),
    plaidId: z.string().optional(),
    accountId: z.string().min(1, { message: "Account ID is required." }),
    type: z.enum(transactionTypeEnum.enumValues, {
        errorMap: (issue, ctx) => {
            if (issue.code === z.ZodIssueCode.invalid_enum_value) {
                return { message: `Invalid transaction type. Must be one of: ${transactionTypeEnum.enumValues.join(', ')}` };
            }
            return { message: ctx.defaultError };
        },
    }),
    category: z.enum(transactionCategoryEnum.enumValues, {
        errorMap: (issue, ctx) => {
            if (issue.code === z.ZodIssueCode.invalid_enum_value) {
                return { message: `Invalid transaction category. Must be one of: ${transactionCategoryEnum.enumValues.join(', ')}` };
            }
            return { message: ctx.defaultError };
        },
    }),
});

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { userId } = getAuth(req);
        
        if(!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const validatedBody = transactionSchema.parse(body);

    } catch (error) {

    }
}