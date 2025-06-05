CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"plaid_id" text,
	"name" text NOT NULL,
	"user_id" text NOT NULL
);
