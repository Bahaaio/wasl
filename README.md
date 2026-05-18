# wasl

wasl is a community-driven platform with posts, comments, media, and voting. The backend is Spring Boot, and the frontend is React (JavaScript) with Tailwind CSS.

## features

- auth with jwt + refresh tokens
- communities, memberships, and roles
- posts, comments, and voting
- media upload/processing (images, gifs, videos)
- search and feed endpoints
- storage abstraction (local filesystem by default, s3-compatible storage via a custom StorageService implementation)

## run with docker compose

requirements: docker + docker compose

```bash
docker compose up --build
```

services:

- backend: <http://localhost:8080>
- frontend: <http://localhost:3000>
- db: postgres on localhost:5432

## run locally

requirements: java 21, maven, node 18+

backend:

```bash
cd backend
mvn spring-boot:run
```

frontend:

```bash
cd frontend
npm install
npm run dev
```

## configuration

backend config is in `backend/src/main/resources/application.yaml`.

key settings:

- `spring.datasource.*` for database
- `security.jwt.*` for jwt settings
- `storage.location` for local file storage
- `media.allowed-types` and max sizes for uploads

## api docs

swagger ui is available at:

- <http://localhost:8080/swagger-ui/index.html>
