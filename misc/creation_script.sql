CREATE TABLE "users" (
  "id" SERIAL UNIQUE PRIMARY KEY NOT NULL,
  "firstname" text,
  "lastname" text,
  "email" text UNIQUE NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "last_update" timestamp DEFAULT (now()),
  "light_mode" boolean DEFAULT true,
  "password" text NOT NULL,
  "password_forgotten" boolean DEFAULT false,
  "refresh_token" text,
  "last_login" timestamp DEFAULT (now())
);

CREATE TABLE "categories" (
  "id" SERIAL UNIQUE PRIMARY KEY NOT NULL,
  "favorite" boolean DEFAULT true,
  "created_at" timestamp DEFAULT (now()),
  "last_update" timestamp,
  "note" text,
  "name" text DEFAULT 'Untitled',
  "user_id" int
);

CREATE TABLE "topics" (
  "id" SERIAL UNIQUE PRIMARY KEY NOT NULL,
  "category_id" int,
  "note" text,
  "name" text DEFAULT 'New topic',
  "created_at" timestamp DEFAULT (now()),
  "last_update" timestamp,
  "favorite" boolean DEFAULT false
);

ALTER TABLE "categories" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "topics" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE CASCADE;
