CREATE TYPE "public"."transaction_category" AS ENUM('Food', 'Car', 'Entertainment', 'Utilities', 'Housing', 'Salary', 'Investments', 'Healthcare', 'Shopping', 'Education', 'Travel', 'Pets', 'Fitness', 'Gifts', 'Miscellaneous');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('Income', 'Expense');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"plaid_id" text,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" text NOT NULL,
	"type" "transaction_type" NOT NULL,
	"category" "transaction_category" NOT NULL,
	"amount" numeric NOT NULL,
	"date" date NOT NULL,
	"plaid_id" text,
	"account_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;