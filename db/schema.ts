import { pgTable, text, uuid } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const accounts = pgTable("accounts", {
    id: uuid("id").primaryKey().default(sql`uuid_generate_v4()`),
    plaidId: text("plaid_id"),
    name: text("name").notNull(),
    type: text("type").notNull(),
    userId: text("user_id").notNull(),
})