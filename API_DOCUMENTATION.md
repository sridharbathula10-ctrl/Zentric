# Zentrix API

Email notification responses include boolean fields such as `emailSent`, `adminEmailSent`, and `customerEmailSent` under `data`. `true` means Resend accepted the email request; it does not confirm delivery to the recipient's inbox. For ticket status updates, `emailSent: null` means no status change occurred, so no email was attempted.

All responses use `{ "success": true, "message": "…", "data": {} }`; failures include `success: false` and a message. Protected calls require the secure `zentrix_token` HTTP-only cookie.

| Method | Endpoint | Role | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create a customer: `name`, `email`, `mobile`, `password`. |
| POST | `/api/contact` | Public | Save a contact form submission: `name`, `email`, optional `mobile`, `category`, and `message`. |
| POST | `/api/auth/login` | Public | Sign in and set the auth cookie. |
| POST | `/api/auth/logout` | Signed in | Clear the auth cookie. |
| GET | `/api/auth/me` | Signed in | Get the current safe user profile. |
| GET | `/api/customer/dashboard` | Customer | Counts and recent tickets. |
| GET, PUT | `/api/customer/profile` | Customer | Read/update `name`, `mobile`. |
| POST, GET | `/api/tickets` | Customer | Create or list own tickets. |
| GET | `/api/tickets/:id` | Owner/Admin | Ticket and conversation. |
| POST | `/api/tickets/:id/comments` | Owner | Add a message. |
| GET | `/api/admin/dashboard` | Admin | Global dashboard data. |
| POST, GET | `/api/admin/tickets` | Admin | Create a ticket with `customerId`, `subject`, `description`, `category`, and `priority`, or list every ticket. |
| GET, PUT | `/api/admin/tickets/:id` | Admin | Read/update status, priority, assignee. |
| POST | `/api/admin/tickets/:id/comments` | Admin | Reply to a ticket. |
| GET | `/api/admin/technicians` | Admin | Active admins for assignment. |
| GET | `/api/admin/customers` | Admin | Customer list and ticket totals. |
| GET, POST | `/api/admin/companies` | Admin | List companies or create one with `name`; customer creation uses `companyId`. |
| PUT, DELETE | `/api/admin/companies/:id` | Admin | Rename a company or delete it when no customers are assigned. |
| GET | `/api/admin/contacts` | Admin | List public contact form submissions; accepts `page` and `limit`. |
| GET | `/api/admin/contacts/:id` | Admin | Read one contact form submission. |
| GET | `/api/admin/customers/:id` | Admin | Customer and ticket history. |

List endpoints accept `page`, `limit`, `search`, `status`, `priority`, and `category`; admin tickets additionally accepts `customer` and `assignedTo`.
