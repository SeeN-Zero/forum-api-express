# Forum API Express

REST API forum diskusi berbasis Node.js dengan pendekatan Clean Architecture.  
Fitur utama: registrasi user, autentikasi JWT, thread, komentar, balasan, dan like komentar.

## Stack
- Node.js (ES Modules)
- Express.js
- PostgreSQL (`pg`)
- JWT (`jsonwebtoken`)
- Bcrypt (`bcrypt`)
- Migration: `node-pg-migrate`
- Testing: Vitest + Supertest
- Process manager: PM2

## Clean Architecture
Pemisahan layer:
- `Domains`: entity dan kontrak repository
- `Applications`: use case (business rules)
- `Infrastructures`: implementasi teknis (PostgreSQL, container DI, server)
- `Interfaces`: route + handler HTTP
- `Commons`: shared concerns (error translation, config, dll)

Alur request:
`Route -> Handler -> Use Case -> Repository -> PostgreSQL`

## Struktur Direktori
```txt
src/
  Applications/
  Commons/
  Domains/
  Infrastructures/
  Interfaces/
migrations/
tests/
.github/workflows/
```

## Prasyarat
- Node.js 20+ (disarankan LTS)
- PostgreSQL aktif
- npm

## Environment Variables
Project membaca konfigurasi dari environment:

```env
HOST=localhost
PORT=5000

PGHOST=localhost
PGPORT=5432
PGDATABASE=forumapi
PGUSER=postgres
PGPASSWORD=postgres

ACCESS_TOKEN_KEY=secret
REFRESH_TOKEN_KEY=secret
ACCESS_TOKEN_AGE=3000
```

Untuk testing lokal, buat file `.env.test` (jangan commit ke repository) dengan nilai test database, contoh:

```env
PGHOST=localhost
PGPORT=5432
PGDATABASE=forumapi_test
PGUSER=postgres
PGPASSWORD=postgres

ACCESS_TOKEN_KEY=secret
REFRESH_TOKEN_KEY=secret
ACCESS_TOKEN_AGE=3000
```

## Menjalankan Aplikasi
Install dependency:

```bash
npm install
```

Jalankan migrasi:

```bash
npm run migrate:up
```

Start app:

```bash
npm run start
```

Mode development:

```bash
npm run start:dev
```

Entry point:
- `src/app.js`

## Scripts Penting
```bash
# app
npm run start
npm run start:dev

# testing
npm test
npm run test:watch
npm run test:coverage
npm run test:integration
npm run test:functional

# migration
npm run migrate:up
npm run migrate:down
npm run migrate:down:step
npm run migrate:test
npm run migrate:test:up
npm run migrate:test:down
npm run migrate:test:down:step

# lint
npm run lint
```

## Daftar Endpoint
### Users
- `POST /users` register user

### Authentications
- `POST /authentications` login
- `PUT /authentications` refresh access token
- `DELETE /authentications` logout

### Threads
- `POST /threads` (auth)
- `GET /threads/:threadId`

### Comments
- `POST /threads/:threadId/comments` (auth)
- `DELETE /threads/:threadId/comments/:commentId` (auth)
- `PUT /threads/:threadId/comments/:commentId/likes` (auth)

### Replies
- `POST /threads/:threadId/comments/:commentId/replies` (auth)
- `DELETE /threads/:threadId/comments/:commentId/replies/:replyId` (auth)

## Testing Strategy
Semua test menggunakan Vitest:
- Unit test: domain, use case, helper
- Integration test: repository + PostgreSQL asli (tanpa mock DB)
- Functional test: HTTP endpoint end-to-end via Supertest

Catatan:
- Integration/functional test berjalan dengan `NODE_ENV=test`
- Migration test dijalankan sebelum integration/functional test
- Tabel test dibersihkan via helper di folder `tests/`

## CI/CD
### CI (`.github/workflows/ci.yml`)
Trigger:
- Pull Request ke `main` atau `master`

Jobs:
- Unit test + coverage threshold 100%
- Integration test (PostgreSQL service container)
- Functional test (PostgreSQL service container)

### CD (`.github/workflows/cd.yml`)
Trigger:
- Push ke `main` atau `master`

Deploy flow (via `appleboy/ssh-action`):
1. SSH ke VM
2. Masuk ke `${APP_DIR}/forum-api-express`
3. `git fetch/checkout/pull` sesuai branch
4. `npm install`
5. `npm run migrate:up`
6. `pm2 restart app || pm2 start npm --name "app" -- start`
7. `pm2 save`

Secrets yang dibutuhkan:
- `SSH_HOST`
- `SSH_USER`
- `SSH_PRIVATE_KEY`
- `APP_DIR`

