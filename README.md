# API Notes

A RESTful API for managing user notes, tags, and links, built with Node.js, Express, SQLite, and Knex. Includes authentication, file uploads (user avatars), and JWT-based security.

## Features

- User registration and authentication (JWT)
- CRUD for notes, with support for tags and links
- File upload for user avatars
- Tag listing per user
- Secure endpoints (protected by JWT)
- SQLite database with Knex migrations

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn

### Installation

```bash
git clone <your-repo-url>
cd api-notes
npm install
cp .env.example .env
# Edit .env with your secrets and port
npm run migrate
npm run dev
```

### Environment Variables

- `AUTH_SECRET`: Secret key for JWT
- `PORT`: Server port (default: 3333)

## Running

- Development: `npm run dev`
- Production: `npm start`

## API Endpoints

All endpoints (except user registration and login) require a valid JWT token in the `Authorization` header.

### Auth

#### Register

- **POST** `/users`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```

#### Login

- **POST** `/sessions`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  ```json
  {
    "token": "jwt-token",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": null,
      "created_at": "...",
      "updated_at": "..."
    }
  }
  ```

### Users

#### Update Profile

- **PUT** `/users`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "New Name",
    "email": "new@example.com",
    "password": "newpassword",
    "old_password": "yourpassword"
  }
  ```

#### Update Avatar

- **PATCH** `/users/avatar`
- **Headers:** `Authorization: Bearer <token>`
- **Form Data:** `avatar` (file)

### Notes

#### Create Note

- **POST** `/notes`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "title": "Note Title",
    "description": "Note description",
    "tags": ["tag1", "tag2"],
    "links": ["https://example.com"]
  }
  ```

#### List Notes

- **GET** `/notes?title=search&tags=tag1,tag2`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  [
    {
      "id": 1,
      "title": "Note Title",
      "user_id": 1,
      "tags": [{ "id": 1, "name": "tag1", "note_id": 1, "user_id": 1 }]
    }
  ]
  ```

#### Get Note by ID

- **GET** `/notes/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "id": 1,
    "title": "Note Title",
    "description": "Note description",
    "user_id": 1,
    "created_at": "...",
    "updated_at": "...",
    "tags": [{ "id": 1, "name": "tag1", "note_id": 1, "user_id": 1 }],
    "links": [
      {
        "id": 1,
        "url": "https://example.com",
        "note_id": 1,
        "created_at": "..."
      }
    ]
  }
  ```

#### Delete Note

- **DELETE** `/notes/:id`
- **Headers:** `Authorization: Bearer <token>`

### Tags

#### List Tags

- **GET** `/tags`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  [{ "id": 1, "name": "tag1", "note_id": 1, "user_id": 1 }]
  ```

## File Uploads

- User avatars are uploaded to `/tmp/uploads` and served at `/files/<filename>`

## Error Handling

Errors are returned in the format:

```json
{
  "status": "error",
  "message": "Error message"
}
```

## License

ISC
