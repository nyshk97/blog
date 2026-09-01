# Security Policy — Shuriken Note

This document outlines the **security design principles and responsibility boundaries** of Shuriken Note.

---

## Core Principles

- **Least privilege**: Access permissions are granted only where necessary
- **Secure by default**: Notes are treated as Private unless explicitly made public
- **Reduced attack surface**: Complex permission systems, collaborative editing, and block-based editors are intentionally not implemented
- **Traceability**: All requests include a `request_id` for tracking and auditing

---

## Authentication

- Authentication is implemented using **JWT + Refresh Tokens**
- All write operations require authentication
- Public note viewing is served via dedicated unauthenticated endpoints

Detailed authentication design is documented in ADR:
https://github.com/nyshk97/blog/blob/main/docs/adr/0004-authentication-strategy.md

---

## Authorization

- The default model allows **only the Owner** to view and edit notes
- Public notes are provided in **read-only** mode
- Visibility and archive state propagate **one-way from parent to child notes**
- Operations on child notes never affect parent note state

This one-way inheritance prevents permission rule complexity.

---

## Public Notes

- Public notes are exposed at `/p/{slug}-{uuid}`
- The slug is used for readability, while access control relies on the UUID
- Public notes are strictly **read-only**, separated from management APIs

Public visibility is treated as **intentional disclosure**,
and URL guessability is not relied upon as a security boundary.

---

## Private Share Links (Future Feature)

- Limited sharing is planned via `/s/{token}` style random tokens
- Tokens will have sufficient length and randomness
- Owners will be able to revoke shared links at any time

---

## Data Lifecycle and Safety

- Archiving is not deletion and is reversible through the UI
- Permanent deletion is only allowed from the Archived state
- Archive and deletion propagate **one-way from parent to child notes**
- Child note operations never affect parent notes

This two-step lifecycle model prevents accidental data loss.

---

## Input and Output Safety

- All requests are validated server-side
- API errors return standardized JSON responses without exposing internal exception details
- Markdown rendering sanitizes unsafe HTML and script content

---

## Infrastructure

- All external communication is conducted over HTTPS
- The application is served behind CloudFront and ALB
- Databases and storage services are not directly exposed to the public network

---

## Logging and Monitoring

- All requests include a `request_id`
- Application errors are collected via Sentry
- Access and audit logs are aggregated in CloudWatch

---

## Security Concerns

This project is designed and developed as a personal product.
If you notice any security concerns, feel free to share them via GitHub Issues.
