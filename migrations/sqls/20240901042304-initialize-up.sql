/* Replace with your SQL commands */

-- CREATE TYPE "profiles_role" AS ENUM (
--   'client',
--   'contractor'
-- );

-- CREATE TYPE "contracts_status" AS ENUM (
--   'new',
--   'in_progress',
--   'terminated'
-- );

CREATE TABLE "profiles" (
  "id" int PRIMARY KEY,
  "uuid" varchar UNIQUE NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL,
  "first_name" varchar NOT NULL,
  "last_name" varchar NOT NULL,
  "profession" varchar NOT NULL,
  "balance" decimal NOT NULL,
  "role" profiles_role NOT NULL,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL
);

CREATE TABLE "contracts" (
  "id" int PRIMARY KEY,
  "uuid" varchar UNIQUE NOT NULL,
  "terms" text NOT NULL,
  "status" contracts_status NOT NULL,
  "contractorId" integer NOT NULL,
 "clientId" integer NOT NULL,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL
);

CREATE TABLE "jobs" (
  "id" int PRIMARY KEY,
  "uuid" varchar UNIQUE NOT NULL,
  "description" text NOT NULL,
  "price" decimal NOT NULL,
  "is_paid" bool NOT NULL,
  "paid_date" date,
  "contract_id" integer NOT NULL,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL
);

COMMENT ON COLUMN "contracts"."terms" IS 'Content of the contract';

COMMENT ON COLUMN "jobs"."description" IS 'Details of the contract job';

ALTER TABLE "contracts" ADD FOREIGN KEY ("contractorId") REFERENCES "profiles" ("id");

ALTER TABLE "contracts" ADD FOREIGN KEY ("clientId") REFERENCES "profiles" ("id");

ALTER TABLE "jobs" ADD FOREIGN KEY ("contract_id") REFERENCES "contracts" ("id");