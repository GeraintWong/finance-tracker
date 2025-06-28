import { pgTable, text, uuid, numeric, pgEnum, date, timestamp } from "drizzle-orm/pg-core"
import { sql, relations } from "drizzle-orm"

export const accounts = pgTable("accounts", {
    id: uuid("id").primaryKey().default(sql`uuid_generate_v4()`),
    plaidId: text("plaid_id"),
    name: text("name").notNull(),
    type: text("type").notNull(),
    userId: text("user_id").notNull(),
})

export const transactionTypeEnum = pgEnum("transaction_type", [
    "Income",
    "Expense",
]);

export const transactionCategoryEnum = pgEnum("transaction_category", [
    "Food",
    "Car",
    "Entertainment",
    "Utilities",
    "Housing",
    "Salary",
    "Investments",
    "Healthcare",
    "Shopping",
    "Education",
    "Travel",
    "Pets",
    "Fitness",
    "Gifts",
    "Miscellaneous",
])

export const transactions = pgTable("transactions", {
    id: uuid("id").primaryKey().default(sql`uuid_generate_v4()`),
    name: text("name").notNull(),
    type: transactionTypeEnum("type").notNull(),
    category: transactionCategoryEnum("category").notNull(),
    amount: numeric("amount", { scale: 2 }).notNull(),
    date: date("date", { mode: "date" }).notNull(),
    plaidId: text("plaid_id"),
    accountId: uuid("account_id").notNull().references(() => accounts.id, { onDelete: 'cascade' }),
})

export const transactionRelations = relations(transactions, ({ one }) => ({
    account: one(accounts, {
        fields: [transactions.accountId],
        references: [accounts.id],
    }),
}))

export const accountRelations = relations(accounts, ({ many }) => ({
    transactions: many(transactions),
}))