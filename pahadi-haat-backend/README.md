# Pahadi Haat — Backend (Spring Boot)

A real REST API for the Pahadi Haat marketplace: JWT auth for Customer /
Seller / Driver accounts, a product & shop catalog, order placement with
server-side pricing, seller inventory management, and driver delivery
tracking.

## Run it

Requires Java 17+ and Maven (or use the included `mvnw` if you add one — a
plain `mvn` is assumed here).

```bash
cd pahadi-haat-backend
mvn spring-boot:run
```

The API starts on **http://localhost:8080**. On first run it seeds the same
demo categories, shops, and products the original static frontend shipped
with, into a local H2 file database at `./data/pahadihaat.mv.db` (so your
data survives restarts). Browse it at `http://localhost:8080/h2-console`
(JDBC URL `jdbc:h2:file:./data/pahadihaat`, user `sa`, empty password).

To point at MySQL/Postgres instead, edit the datasource lines in
`src/main/resources/application.properties` (commented examples included)
and add the relevant JDBC driver dependency to `pom.xml`.

## Auth

Stateless JWT. Every signup/login endpoint returns a token:

```json
{ "token": "...", "role": "customer", "name": "Priya", "email": "priya@example.com" }
```

Send it back as `Authorization: Bearer <token>` on protected requests.
Tokens expire after 24h (`app.jwt.expiration-ms`).

**⚠️ Change `app.jwt.secret` before deploying anywhere real.**

## Endpoints

### Public
| Method | Path | Notes |
|---|---|---|
| POST | `/api/auth/signup` | Customer signup |
| POST | `/api/auth/seller/register` | Seller signup — also creates their shop |
| POST | `/api/auth/driver/register` | Driver signup |
| POST | `/api/auth/login` | `{ email, password, role }` |
| GET | `/api/categories` | |
| GET | `/api/shops`, `/api/shops/{id}` | |
| GET | `/api/products?category=&shopId=`, `/api/products/{id}` | |

### Authenticated (any role)
| Method | Path | Notes |
|---|---|---|
| POST | `/api/orders` | Places an order from cart lines; prices are recomputed server-side |
| GET | `/api/orders/{orderId}` | Full order detail |
| GET | `/api/orders/{orderId}/tracking` | Status + step timeline |

### Seller only
| Method | Path | Notes |
|---|---|---|
| GET | `/api/seller/shop` | The logged-in seller's shop |
| GET | `/api/seller/products` | Their inventory |
| POST | `/api/seller/products` | Add a product |
| PUT | `/api/seller/products/{id}` | Edit a product |
| PUT | `/api/seller/products/{id}/stock` | Update stock count |
| DELETE | `/api/seller/products/{id}` | Remove a product |

### Driver only
| Method | Path | Notes |
|---|---|---|
| GET | `/api/driver/deliveries` | Deliveries assigned to them + open/unassigned ones |
| PUT | `/api/driver/deliveries/{orderId}/accept` | Claim a delivery |
| PUT | `/api/driver/deliveries/{orderId}/status` | `{ "status": "SHIPPED" }` or `"DELIVERED"` |

## CORS

Configured for `http://localhost:5173` (the Vite dev server) via
`app.cors.allowed-origins` in `application.properties`. Add your deployed
frontend origin there before going live.

## Project layout

```
src/main/java/com/pahadihaat/backend/
  config/       SecurityConfig, DataSeeder
  security/     JwtService, JwtAuthFilter, CustomUserDetailsService
  model/        JPA entities
  repository/   Spring Data repositories
  dto/          Request/response shapes, grouped by feature
  service/      Business logic
  controller/   REST endpoints
  exception/    ApiException + a global @RestControllerAdvice handler
```
