/* Replace with your SQL commands */

CREATE TYPE "profiles_role" AS ENUM (
  'client',
  'contractor'
);

CREATE TYPE "contracts_status" AS ENUM (
  'new',
  'in_progress',
  'terminated'
);

CREATE TABLE "profiles" (
  "id" bigserial PRIMARY KEY,
  "uuid" varchar UNIQUE NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL,
  "first_name" varchar NOT NULL,
  "last_name" varchar NOT NULL,
  "profession" varchar NOT NULL,
  "balance" decimal NOT NULL DEFAULT 0.0,
  "role" profiles_role NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE "contracts" (
  "id" bigserial PRIMARY KEY,
  "uuid" varchar UNIQUE NOT NULL,
  "terms" text NOT NULL,
  "status" contracts_status NOT NULL DEFAULT 'new',
  "contractor_id" integer NOT NULL,
  "client_id" integer NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE "jobs" (
  "id" bigserial PRIMARY KEY,
  "uuid" varchar UNIQUE NOT NULL,
  "description" text NOT NULL,
  "price" decimal NOT NULL DEFAULT 0.0,
  "is_paid" bool NOT NULL DEFAULT false,
  "paid_date" date DEFAULT NULL,
  "contract_id" integer NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

COMMENT ON COLUMN "contracts"."terms" IS 'Content of the contract';

COMMENT ON COLUMN "jobs"."description" IS 'Details of the contract job';

ALTER TABLE "contracts" ADD FOREIGN KEY ("contractor_id") REFERENCES "profiles" ("id");

ALTER TABLE "contracts" ADD FOREIGN KEY ("client_id") REFERENCES "profiles" ("id");

ALTER TABLE "jobs" ADD FOREIGN KEY ("contract_id") REFERENCES "contracts" ("id");

ALTER TABLE "profiles" ADD CONSTRAINT balance_non_negative CHECK (balance >= 0.0);

ALTER TYPE "contracts_status" ADD VALUE 'completed';
