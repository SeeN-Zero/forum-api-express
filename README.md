# Forum API

TEST CI

REST API forum diskusi berbasis Node.js dengan pendekatan **Clean Architecture**.  
Project ini mencakup fitur autentikasi, thread, komentar, balasan, dan like komentar, dengan PostgreSQL sebagai database.

## Tech Stack

- Node.js (ES Modules)
- Express.js
- PostgreSQL (`pg`)
- JSON Web Token (`jsonwebtoken`)
- Bcrypt (`bcrypt`)
- Vitest + Supertest
- Node PG Migrate
- PM2 (untuk process manager di server)

## Arsitektur

Project mengikuti pemisahan layer:

- `Domains`: entity dan kontrak repository
- `Applications`: use case (business logic)
- `Infrastructures`: implementasi repository PostgreSQL, container DI, HTTP server
- `Interfaces`: route dan handler HTTP

Alur request:
`Route -> Handler -> Use Case -> Repository -> Database`

## Struktur Folder Utama

```txt
src/
  Applications/
  Commons/
  Domains/
  Infrastructures/
  Interfaces/
migrations/
tests/
```

## Prasyarat

- Node.js 20+ (disarankan LTS terbaru)
- PostgreSQL aktif
- npm

## Setup Lokal

1. Install dependency:

```bash
npm install
```

2. Siapkan environment:

- Copy `.env` sesuai kebutuhan environment lokal
- Copy `.env.test` untuk environment testing

Variabel penting:

- `HOST`
- `PORT`
- `PGHOST`
- `PGPORT`
- `PGUSER`
- `PGPASSWORD`
- `PGDATABASE`
- `DATABASE_URL`
- `ACCESS_TOKEN_KEY`
- `REFRESH_TOKEN_KEY`
- `ACCESS_TOKEN_AGE`

3. Jalankan migrasi database:

```bash
npm run migrate:up
```

4. Jalankan aplikasi:

```bash
npm run start
```

Mode development:

```bash
npm run start:dev
```

## Scripts

```bash
# testing
npm test
npm run test:watch
npm run test:coverage
npm run test:integration
npm run test:functional

# migration
npm run migrate:up
npm run migrate:down
npm run migrate:test:up
npm run migrate:test:down

# lint
npm run lint
```

## Endpoint API

### Users

- `POST /users` -> registrasi user

### Authentications

- `POST /authentications` -> login (access token + refresh token)
- `PUT /authentications` -> refresh access token
- `DELETE /authentications` -> logout (hapus refresh token)

### Threads

- `POST /threads` (auth) -> buat thread
- `GET /threads/:threadId` -> detail thread
- `POST /threads/:threadId/comments` (auth) -> tambah komentar
- `DELETE /threads/:threadId/comments/:commentId` (auth) -> hapus komentar (soft delete)
- `PUT /threads/:threadId/comments/:commentId/likes` (auth) -> toggle like komentar
- `POST /threads/:threadId/comments/:commentId/replies` (auth) -> tambah balasan
- `DELETE /threads/:threadId/comments/:commentId/replies/:replyId` (auth) -> hapus balasan (soft delete)

## Testing

Project memiliki tiga lapisan pengujian:

- Unit test: validasi domain/use case secara terisolasi
- Integration test: validasi repository dengan PostgreSQL nyata
- Functional test: validasi end-to-end via HTTP menggunakan Supertest

Catatan:

- Integration dan functional test menggunakan `NODE_ENV=test`
- Migration test dijalankan melalui script `migrate:test:up`
- Database test dibersihkan menggunakan helper di folder `tests/`

## CI/CD

- CI: workflow `.github/workflows/ci.yml`
  - unit test
  - integration test
  - functional test
- CD: workflow `.github/workflows/cd.yml`
  - deploy ke VM via SSH
  - `npm install`
  - `npm run migrate:up`
  - `pm2 restart app || pm2 start npm --name "app" -- start`

