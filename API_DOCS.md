# 📡 Smart Leads — API Documentation

**Base URL:** `http://localhost:5000/api`

All protected routes require the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

All responses follow this format:
```json
{
  "success": true | false,
  "message": "Description of result",
  "data": { ... },
  "meta": { ... },
  "errors": [ ... ]
}
```

---

## 🔐 Auth Endpoints

### POST `/auth/register`
Register a new user.

**Auth required:** No

**Request Body:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "Rahul@123",
  "role": "sales"
}
```

**Validation Rules:**
- `name` — required, 2–50 characters
- `email` — required, valid email format
- `password` — required, min 8 chars, must include uppercase + lowercase + number
- `role` — optional, `"admin"` or `"sales"` (default: `"sales"`)

**Success Response — 201:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "role": "sales"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400` — Validation failed
- `409` — Email already exists

---

### POST `/auth/login`
Login with existing credentials.

**Auth required:** No

**Request Body:**
```json
{
  "email": "rahul@example.com",
  "password": "Rahul@123"
}
```

**Success Response — 200:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "role": "sales"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400` — Validation failed
- `401` — Invalid email or password

---

### GET `/auth/me`
Get the currently logged-in user's profile.

**Auth required:** Yes

**Success Response — 200:**
```json
{
  "success": true,
  "message": "User profile retrieved",
  "data": {
    "user": {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "role": "sales",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Responses:**
- `401` — No token / invalid token

---

### GET `/auth/users`
Get all registered users.

**Auth required:** Yes — **Admin only**

**Success Response — 200:**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
        "name": "Rahul Sharma",
        "email": "rahul@example.com",
        "role": "sales",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

**Error Responses:**
- `401` — Not authenticated
- `403` — Not an admin

---

## 📋 Lead Endpoints

### GET `/leads`
Get a paginated, filtered list of leads.

**Auth required:** Yes

> **Note:** Sales users only see leads they created. Admins see all leads.

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Results per page (default: 10, max: 100) |
| `status` | string | No | Filter by status: `New`, `Contacted`, `Qualified`, `Lost` |
| `source` | string | No | Filter by source: `Website`, `Instagram`, `Referral` |
| `search` | string | No | Search by name or email (case-insensitive) |
| `sort` | string | No | `latest` (default) or `oldest` |

**Example Request:**
```
GET /api/leads?page=1&limit=10&status=Qualified&source=Instagram&search=rahul&sort=latest
```

**Success Response — 200:**
```json
{
  "success": true,
  "message": "Leads retrieved successfully",
  "data": {
    "leads": [
      {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
        "name": "Rahul Sharma",
        "email": "rahul@example.com",
        "status": "Qualified",
        "source": "Instagram",
        "notes": "Interested in premium plan",
        "createdBy": {
          "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
          "name": "Admin User",
          "email": "admin@example.com"
        },
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-16T08:00:00.000Z"
      }
    ]
  },
  "meta": {
    "currentPage": 1,
    "totalPages": 5,
    "totalCount": 48,
    "limit": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### GET `/leads/:id`
Get a single lead by ID.

**Auth required:** Yes

> Sales users can only view their own leads.

**URL Params:**
- `id` — MongoDB ObjectId of the lead

**Success Response — 200:**
```json
{
  "success": true,
  "message": "Lead retrieved successfully",
  "data": {
    "lead": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "status": "New",
      "source": "Website",
      "notes": "Found us via Google Ads",
      "createdBy": {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
        "name": "Admin User",
        "email": "admin@example.com"
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400` — Invalid ID format
- `403` — Access denied (sales user viewing someone else's lead)
- `404` — Lead not found

---

### POST `/leads`
Create a new lead.

**Auth required:** Yes

**Request Body:**
```json
{
  "name": "Priya Patel",
  "email": "priya@example.com",
  "status": "New",
  "source": "Referral",
  "notes": "Referred by existing client Rahul"
}
```

**Validation Rules:**
- `name` — required, 2–100 characters
- `email` — required, valid email format
- `status` — optional, one of: `New`, `Contacted`, `Qualified`, `Lost` (default: `New`)
- `source` — required, one of: `Website`, `Instagram`, `Referral`
- `notes` — optional, max 500 characters

**Success Response — 201:**
```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": {
    "lead": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
      "name": "Priya Patel",
      "email": "priya@example.com",
      "status": "New",
      "source": "Referral",
      "notes": "Referred by existing client Rahul",
      "createdBy": {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
        "name": "Admin User",
        "email": "admin@example.com"
      },
      "createdAt": "2024-01-17T09:00:00.000Z",
      "updatedAt": "2024-01-17T09:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400` — Validation failed

---

### PUT `/leads/:id`
Update an existing lead.

**Auth required:** Yes

> Sales users can only update their own leads.

**URL Params:**
- `id` — MongoDB ObjectId of the lead

**Request Body** (all fields optional):
```json
{
  "name": "Priya Patel",
  "email": "priya.new@example.com",
  "status": "Contacted",
  "source": "Instagram",
  "notes": "Called on 17th Jan, interested"
}
```

**Success Response — 200:**
```json
{
  "success": true,
  "message": "Lead updated successfully",
  "data": {
    "lead": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
      "name": "Priya Patel",
      "email": "priya.new@example.com",
      "status": "Contacted",
      "source": "Instagram",
      "notes": "Called on 17th Jan, interested",
      "createdAt": "2024-01-17T09:00:00.000Z",
      "updatedAt": "2024-01-17T11:30:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400` — Validation failed / Invalid ID
- `403` — Access denied
- `404` — Lead not found

---

### DELETE `/leads/:id`
Delete a lead permanently.

**Auth required:** Yes

> Sales users can only delete their own leads.

**URL Params:**
- `id` — MongoDB ObjectId of the lead

**Success Response — 200:**
```json
{
  "success": true,
  "message": "Lead deleted successfully",
  "data": null
}
```

**Error Responses:**
- `400` — Invalid ID format
- `403` — Access denied
- `404` — Lead not found

---

### GET `/leads/stats`
Get lead counts grouped by status and source.

**Auth required:** Yes

> Sales users only see stats for their own leads.

**Success Response — 200:**
```json
{
  "success": true,
  "message": "Lead stats retrieved",
  "data": {
    "totalCount": 48,
    "byStatus": {
      "New": 15,
      "Contacted": 18,
      "Qualified": 10,
      "Lost": 5
    },
    "bySource": {
      "Website": 20,
      "Instagram": 18,
      "Referral": 10
    }
  }
}
```

---

### GET `/leads/export`
Export leads as a CSV file with current filters applied.

**Auth required:** Yes

> Sales users only export their own leads.

**Query Parameters:** Same as `GET /leads` (except `page` and `limit` — exports all matching records)

**Example Request:**
```
GET /api/leads/export?status=Qualified&sort=latest
```

**Success Response — 200:**
- Content-Type: `text/csv`
- Content-Disposition: `attachment; filename="leads-export-2024-01-17.csv"`
- Body: CSV file content

**CSV Columns:**
```
Name, Email, Status, Source, Notes, Created At
```

---

## ⚠️ Error Response Format

All errors return in this structure:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": ["field-level error 1", "field-level error 2"]
}
```

### Common HTTP Status Codes

| Code | Meaning |
|---|---|
| `200` | Success |
| `201` | Resource created |
| `400` | Bad request / Validation error |
| `401` | Unauthenticated (no/invalid token) |
| `403` | Unauthorized (wrong role) |
| `404` | Resource not found |
| `409` | Conflict (e.g. email already exists) |
| `429` | Too many requests (rate limited) |
| `500` | Internal server error |

---

## 🔒 Rate Limiting

- **Window:** 15 minutes
- **Max requests:** 100 per IP per window
- Exceeding the limit returns `429 Too Many Requests`

---

## 📝 Data Models

### User
```ts
{
  _id: ObjectId
  name: string           // 2–50 chars
  email: string          // unique, lowercase
  password: string       // bcrypt hashed, never returned
  role: "admin" | "sales"
  createdAt: Date
  updatedAt: Date
}
```

### Lead
```ts
{
  _id: ObjectId
  name: string           // 2–100 chars
  email: string          // lowercase
  status: "New" | "Contacted" | "Qualified" | "Lost"
  source: "Website" | "Instagram" | "Referral"
  notes?: string         // max 500 chars
  assignedTo?: ObjectId  // ref: User
  createdBy: ObjectId    // ref: User
  createdAt: Date
  updatedAt: Date
}
```
