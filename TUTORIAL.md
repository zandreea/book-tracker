# Bookie — Project Setup Tutorial

A step-by-step record of how we set up the Bookie book club tracker API from scratch.

---

## Stack

- **NestJS** — backend framework
- **PostgreSQL** — database
- **Prisma** — ORM
- **Docker** — running Postgres locally

---

## 1. Initialize the NestJS Project

```bash
nest new bookie
```

This creates a new NestJS project with a basic module, controller, and service.

---

## 2. Set Up PostgreSQL with Docker

Make sure Docker Desktop is installed and running, then spin up a Postgres container:

```bash
docker run --name bookie -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

- `--name bookie` — names the container
- `-e POSTGRES_PASSWORD=postgres` — sets the default postgres user password
- `-p 5432:5432` — maps host port 5432 to container port 5432
- `-d` — runs in the background
- `postgres` — the image to use

Verify it's running:

```bash
docker ps
```

You should see `0.0.0.0:5432->5432/tcp` in the PORTS column.

---

## 3. Install Prisma

```bash
npm install -D prisma       # CLI — dev dependency only
npm install @prisma/client  # Client — used at runtime
```

Initialize Prisma in the project:

```bash
npx prisma init
```

This creates:
- `prisma/schema.prisma` — where your data models live
- `prisma.config.ts` — Prisma configuration file
- `.env` — environment variables (add this to `.gitignore`!)

---

## 4. Configure the Database URL

In `.env`:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bookie"
```

In `prisma/schema.prisma`, make sure the datasource block reads:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

In `prisma.config.ts`, make sure it reads:

```ts
datasource: {
  url: env("DATABASE_URL"),
}
```

> Common mistake: passing the connection string directly into `env()` instead of the variable name.

Also update the generator block in `schema.prisma` to use `prisma-client-js` for CommonJS compatibility with NestJS:

```prisma
generator client {
  provider = "prisma-client-js"
}
```

---

## 5. Define the Data Models

In `prisma/schema.prisma`:

```prisma
model User {
  id          Int          @id @default(autoincrement())
  email       String       @unique
  name        String
  password    String
  createdAt   DateTime     @default(now())
  role        Role         @default(USER)
  memberships Membership[]
}

model Book {
  id      Int      @id @default(autoincrement())
  name    String
  author  String
  genres  String[]
}

model BookClub {
  id          Int          @id @default(autoincrement())
  name        String
  mainGenre   String
  createdAt   DateTime     @default(now())
  userId      Int
  createdBy   User         @relation(fields: [userId], references: [id])
  memberships Membership[]
}

model Membership {
  id         Int            @id @default(autoincrement())
  userId     Int
  bookClubId Int
  user       User           @relation(fields: [userId], references: [id])
  bookClub   BookClub       @relation(fields: [bookClubId], references: [id])
  role       MembershipRole @default(MEMBER)
}

enum Role {
  USER
  ADMIN
}

enum MembershipRole {
  MEMBER
  ADMIN
}
```

**Key concepts:**
- Scalar types (`String`, `Int`, `DateTime`) become database columns
- Model types (`User`, `BookClub`) are relations — no column is created
- Every relation needs to be defined on **both sides**
- Foreign keys (`userId`, `bookClubId`) must be declared explicitly as `Int` fields alongside the relation field

---

## 6. Run the First Migration

```bash
npx prisma migrate dev --name init
```

- Creates a `prisma/migrations/` folder with the SQL
- Applies the migration to your database
- Regenerates the Prisma Client

Verify the tables were created by connecting to the database:

```bash
docker exec -it bookie psql -U postgres -d bookie
```

Then inside the Postgres shell:

```sql
\dt
```

You should see: `Book`, `BookClub`, `Membership`, `User`, and `_prisma_migrations`.

Type `\q` to exit.

---

## 7. Set Up Prisma in NestJS

Generate a Prisma module and service:

```bash
nest generate module prisma
nest generate service prisma
```

In `src/prisma/prisma.service.ts`:

```ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect();
  }
}
```

In `src/prisma/prisma.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

- `providers` — makes `PrismaService` available inside this module
- `exports` — makes `PrismaService` available to any module that imports `PrismaModule`

NestJS automatically adds `PrismaModule` to `AppModule` imports when generated.

---

## 8. Verify Everything Works

```bash
npm run start:dev
```

If the app starts without errors, your NestJS app is connected to Postgres via Prisma. ✅

---

## Next Steps

- Auth — register and login with password hashing and JWT
- Book club CRUD + membership management
- Books and reading lists
- Reviews and reading progress