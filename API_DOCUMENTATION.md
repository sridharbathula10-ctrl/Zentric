# Zentrix API

All responses use `{ "success": true, "message": "…", "data": {} }`; failures include `success: false` and a message. Protected calls require the secure `zentrix_token` HTTP-only cookie.

| Method | Endpoint | Role | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create a customer: `name`, `email`, `mobile`, `password`. |
| POST | `/api/auth/login` | Public | Sign in and set the auth cookie. |
| POST | `/api/auth/logout` | Signed in | Clear the auth cookie. |
| GET | `/api/auth/me` | Signed in | Get the current safe user profile. |
| GET | `/api/customer/dashboard` | Customer | Counts and recent tickets. |
| GET, PUT | `/api/customer/profile` | Customer | Read/update `name`, `mobile`. |
| POST, GET | `/api/tickets` | Customer | Create or list own tickets. |
| GET | `/api/tickets/:id` | Owner/Admin | Ticket and conversation. |
| POST | `/api/tickets/:id/comments` | Owner | Add a message. |
| GET | `/api/admin/dashboard` | Admin | Global dashboard data. |
| GET | `/api/admin/tickets` | Admin | List every ticket. |
| GET, PUT | `/api/admin/tickets/:id` | Admin | Read/update status, priority, assignee. |
| POST | `/api/admin/tickets/:id/comments` | Admin | Reply to a ticket. |
| GET | `/api/admin/technicians` | Admin | Active admins for assignment. |
| GET | `/api/admin/customers` | Admin | Customer list and ticket totals. |
| GET | `/api/admin/customers/:id` | Admin | Customer and ticket history. |

List endpoints accept `page`, `limit`, `search`, `status`, `priority`, and `category`; admin tickets additionally accepts `customer` and `assignedTo`.
