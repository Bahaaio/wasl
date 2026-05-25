# wasl

![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

Wasl is a modern community platform for focused conversations, rich media, and personalized feeds.

## stack

- Backend: Spring Boot, Spring Security, JWT, PostgreSQL
- Frontend: React (JavaScript), Tailwind CSS
- Storage: Local filesystem or S3-compatible object storage

## features

Communities, memberships, and roles: Create communities, manage membership, and gate actions by role.

Posts, comments, and voting: Threaded discussions with voting and score tracking.

Feed and search: A home feed that supports latest, top, and hot sorting plus search across content. See [search](backend/src/main/java/com/github/bahaaio/wasl/search/).

Media pipeline: Uploads are validated, type-detected, processed, and stored with a thumbnail and full variant. See [MediaService](backend/src/main/java/com/github/bahaaio/wasl/media/service/MediaService.java).

Media pipeline details:

- File type is detected from content (not just the file extension).
- Size limits are enforced per media type.
- Images/GIFs/videos are processed and normalized.
- Thumbnails are generated and stored alongside full media.
- Uploads are stored immediately as TEMP and later attached to an owner.
- Orphaned TEMP media is cleaned by a scheduled job. See [OrphanMediaCleanupJob](backend/src/main/java/com/github/bahaaio/wasl/media/job/OrphanMediaCleanupJob.java).

## quick start

Requirements: Docker + Docker Compose

```bash
docker compose up
```

Then open:

- Backend: <http://localhost:8080>
- Frontend: <http://localhost:3000>

## run locally

Requirements: Java 21, Maven, Node 18+

Backend:

```bash
cd backend
mvn spring-boot:run
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## configuration

Backend configuration is documented in [backend/README.md](backend/README.md). See that guide for detailed settings, S3 deployment, and media pipeline behavior.

Example environment variables live in [backend/.env.example](backend/.env.example).

## architecture

The backend follows a vertical-slice style where each module owns its controllers, services, DTOs, and repositories. See:

- Communities: [community](backend/src/main/java/com/github/bahaaio/wasl/community/)
- Posts: [post](backend/src/main/java/com/github/bahaaio/wasl/post/)
- Comments: [comment](backend/src/main/java/com/github/bahaaio/wasl/comment/)
- Votes: [vote](backend/src/main/java/com/github/bahaaio/wasl/vote/)
- Media: [media](backend/src/main/java/com/github/bahaaio/wasl/media/)

## error responses

Errors are returned in a structured JSON format via exception handlers.

Example (validation error):

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": [
    {
      "field": "title",
      "message": "must not be blank"
    }
  ]
}
```

Example (not found):

```json
{
  "code": "POST_NOT_FOUND",
  "message": "Post with id: 123 not found",
  "details": null
}
```

## api docs

Swagger UI:

- <http://localhost:8080/swagger-ui/index.html>
