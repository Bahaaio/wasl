# Backend configuration

This document explains the backend configuration and deployment options.

## Application settings

The backend reads config from `backend/src/main/resources/application.yaml`.

### Database

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/wasl_db # postgres connection string
    username: user
    password: password
```

### Auth (JWT)

```yaml
security:
  jwt:
    secret: "<jwt-secret>" # signing key
    expires-in: 15m # access token duration
  refresh:
    expires-in: 7d # refresh token duration
    token-byte-length: 64
```

### Media pipeline

```yaml
media:
  cleanup:
    cron: "0 0 0 * * *" # cleanup schedule for orphaned temp media
    retention: 1d # temp media retention

  max-image-size: 15MB
  max-gif-size: 5MB
  max-video-size: 100MB

  allowed-types:
    - image/jpeg
    - image/png
    - image/gif
    - image/webp
    - video/mp4
    - video/webm
    - video/quicktime
```

Media processing flow:

- Detect file type from content
- Validate size and allowed types
- Process and normalize media
- Generate thumbnails
- Store full + thumbnail variants

## Storage

Storage is controlled via the `storage.*` section. The active storage is selected by `storage.type`.

### Local storage

```yaml
storage:
  type: local
  local:
    location: upload # local directory for files
```

### S3-compatible storage

```yaml
storage:
  type: s3
  s3:
    bucket: ${S3_BUCKET}
    region: ${S3_REGION}
    endpoint: ${S3_ENDPOINT} # aws or any s3-compatible endpoint
```

Environment variables used by default:

- `S3_BUCKET`
- `S3_REGION`
- `S3_ENDPOINT`

The S3 implementation uses `S3StorageService` and supports any S3-compatible endpoint (AWS, MinIO, etc.).

## Deploy notes

- Ensure the bucket is created and accessible
- Set `storage.type: s3`
- Configure credentials for the AWS SDK (env vars or instance profile)

## Example env file

```env
S3_BUCKET=my-bucket
S3_REGION=eu-central-1
S3_ENDPOINT=https://my.custom.endpoint.com

AWS_ACCESS_KEY_ID=aws_access_key
AWS_SECRET_ACCESS_KEY=aws_secret_access_key
```

See `backend/.env.example` for the full template.
