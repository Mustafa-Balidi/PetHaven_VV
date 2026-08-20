# Pet Adopter frontend-to-backend integration audit

Audit date: 2026-08-19

Scope: Pet Adopter routes and shared authentication/store components in `frontend`, checked against the current `backend` controllers, DTOs, and services. The backend was inspected read-only and was not changed.

## Route and contract inventory

| Route | Page / main components | Frontend API | Actual backend endpoint(s) | Auth | Result |
|---|---|---|---|---|---|
| `/` | `PublicPage`, `AuthModal` | `authApi` | `POST /api/Auth/register`, `POST /api/Auth/login` | Public | Connected; registration UI role `Pet Owner` is intentionally mapped by the backend to `Adopter`. Google OAuth has no backend support. |
| `/adopter/dashboard` | `PetHavenDashboardPage`, KPI, wallet, pets, wishlist, care calendar | `dashboardApi`, `profileApi`, `petsApi`, `wishlistApi` | `GET /api/AdopterDashboard/adopter`, `GET /api/Profile/me`, `GET /api/AdopterDashboard/adopted-pets`, `GET /api/Wishlist` | Adopter | Connected. Care calendar is honestly marked unavailable. Backend `RecentOrdersCount` is actually all orders, despite its name. Backend milestone days are based on `LastReportDate`, not the adoption date. |
| `/adopter/profile` | `AdopterProfile` | `profileApi` | `GET /api/Profile/me`, `PUT /api/Profile/update/adopter` | Adopter | Connected for displayed fields. `HasPetBefore`, `ImageUrl`/`ProfileImageUrl` exist in the contract but are not editable here. |
| `/adopter/store` | `PetHavenShopPage`, `Sidebar`, `ProductCard` | `shopApi`, `wishlistApi`, `cartData`, `order.js` | `GET /api/StoreCatalog/Categories`, `GET /api/StoreCatalog/Products`, `GET /api/ProductRatings/{id}`, wishlist GET/POST/DELETE, cart add, `GET /api/Orders/my-orders` | Route: Adopter; catalog endpoints public | Connected after fixes. Filtering/paging is client-side. Ratings require one request per product. Hero/trust copy is static marketing content. |
| `/adopter/product?id=:id` | `PetHavenProductPage`, product details/reviews | `productApi`, `cartData` | `GET /api/StoreCatalog/Products/{id}`, `GET/POST /api/ProductRatings`, `POST /api/Cart/Add` | Route: Adopter; reads public | Connected. A missing ID is now an error instead of silently loading product 1. |
| `/adopter/cart` | `ShoppingCart` | `cartData` | `GET /api/Cart`, `PUT /api/Cart/UpdateItem/{cartItemId}`, `DELETE /api/Cart/RemoveItem/{cartItemId}`, `DELETE /api/Cart/Clear` | Adopter | Connected. Totals map to `CartTotal`, `UnitPrice`, and `TotalPrice`. |
| `/adopter/checkout` | `CheckoutPage` | `cartData`, `orderApi` | `POST /api/Orders/checkout`, `POST /api/Payments/checkout` | Adopter | Partially connected. The backend creates the order, deducts the adopter balance, creates a payment, and marks the order Paid. It does not process Stripe/ShamCash or card fields; those visible inputs are not part of the DTO. |
| `/adopter/order-confirmed?orderId=:id` | `OrderConfirmed` | `orderApi` | `GET /api/Orders/my-orders` | Adopter | Connected through the supported order list and client-side ID selection. No dedicated order-details endpoint exists. Missing/unknown IDs no longer show an arbitrary order. Delivery/address/shipping data has no backend fields and remains unavailable. |
| `/adopter/order-details?orderId=:id` | `OrderDetailsModal` | `orderApi` | `GET /api/Orders/my-orders` | Adopter | Fixed: uses the real selected order instead of `orderData.js`. Invoice download and buy-again are disabled because no backend endpoints exist. |
| `/adopter/adoption-hub` | catalog, requests, adopted pets, compatibility quiz, application modal | `adoptionHubApi` | `GET /api/Pets/AllPets`, `GET /api/AdopterDashboard/adopted-pets`, `POST /api/Adoption/SubmitRequest`, `POST /api/Recommendations/services` | Adopter route; pets public | Catalog, adopted pets, submission, and recommendation call are connected. “My Requests” is broken/unsupported because the backend exposes no adopter request-list endpoint. |
| `/adopter/application-details/:requestId` | `ApplicationDetailsPage` | `adoptionHubApi` | Frontend calls `GET /api/Adoption/MyRequests/{id}` | Adopter | Unsupported: this endpoint and service operation do not exist. |
| `/adopter/pet-profile/:petId` | `PetProfilePage`, `PetHeroCard` | `petProfileApi` | `GET /api/Pets/{id}` | Adopter route; endpoint public | Connected to pet identity, species, breed, age, gender, health, description, image, center, and status. |
| `/adopter/pet-profile` | Same page without ID | none until valid ID | none | Adopter | Honest missing-ID state; no record is fabricated. |
| `/adopter/health` | `PetHavenHealthAssistant` | `healthAssistantMockData` | None | Adopter route only | Mock-only and unsupported. Chat/history are local state and fake seeded records; sending a message does not call a backend or AI service. |
| `/adopter/vets` | `VetHubPage` | `vetApi` | `GET /api/Vet/search` | Adopter route; endpoint public | Connected for specialization, distance, rating, experience, verification, and location sorting. |
| `/adopter/vets/book/:vetId` | `BookAppointmentPage` | `vetApi` | `GET /api/Vet/{id}`, `GET /api/AdopterDashboard/adopted-pets` | Adopter | Connected. Backend has no availability/slot endpoint, so date/time availability cannot be verified in advance. |
| `/adopter/vets/confirm` | `ConfirmAppointmentPage` | `vetApi` | `POST /api/Appointments/book` | Adopter | Connected; exact DTO fields are `PetId`, `VetId`, `AppointmentDate`, and `Reason`. |
| `/adopter/vets/visits` | `MyVisitsPage`, appointment actions/rating | `vetApi` | Frontend calls unsupported appointment list/detail/reschedule endpoints; cancel and rating endpoints do exist | Adopter | Mostly unsupported. Backend has only adopter book and cancel. It has no adopter list, detail, or reschedule endpoint, so existing appointments cannot be loaded and cancel/rating cannot be reached reliably from real data. |

All `/adopter/*` routes are protected with the actual backend role string `Adopter`. A 401 now clears session data and redirects to `/`. Logout clears the stored session. There is no backend refresh-token endpoint, so the stored refresh token cannot refresh a session.

## Correctly connected

- Email/password register and login, role redirect, logout, protected Adopter routes.
- Dashboard KPIs, wallet/profile data, adopted-pet cards, wishlist cards.
- Available pet catalog, filters, pet details, adopted pets, and adoption submission.
- Store categories/products, product detail, product ratings/reviews, cart operations.
- Wishlist load/add/remove and optimistic UI rollback.
- Order creation, balance-backed payment recording, order history, and real order selection.
- Vet search/detail, adopted-pet selection, appointment booking, and the vet-rating POST contract itself.

## Partial or broken because backend support is missing

- Adoption request history/details: the frontend calls `Adoption/MyRequests` routes that do not exist. The backend service also has no adopter query operation.
- Adopter appointment history/details/reschedule: the routes do not exist. `PUT /Appointments/reschedule/{id}` is Vet-only.
- Vet rating is implemented in the frontend and backend, but the UI exposes it only for completed appointments; those appointments cannot be loaded by an adopter.
- Payment UI presents external payment methods/card fields, but the backend only performs an internal balance deduction and ignores `TransactionId`.
- Order details has no dedicated endpoint. The safe frontend integration filters the authenticated `my-orders` response by ID.
- Product/order image fields are not present in cart/order DTOs. The UI must not invent them.
- No appointment availability, invoice, buy-again, shipping, delivery estimate, transaction history, notification, or Google OAuth API exists.

## Mock/static/fake data still active

- `PetHavenHealthAssistant` actively imports `healthAssistantMockData.js`; Daisy/Luna sessions and chat messages are fake.
- Store hero and trust content are static marketing content, not backend catalog records.
- Header logo/avatar images are static design assets. Notifications correctly state that the feature is unavailable.
- Public landing-page testimonials/events/articles are static, shared public content and were outside the adopter integration mutation scope.

`api/orderData.js` still contains an old fabricated order but is no longer imported or displayed. Some unused legacy mock helpers also remain in `shopApi.js`; they do not feed the current adopter screens.

## Backend functionality not used by the adopter frontend

- `POST /api/PetReports/SubmitReport` and `CreatePetReportDto` are not connected anywhere in the adopter UI.
- `GET /api/VetRatings/{vetId}` (average rating) is not called directly; vet search already returns average and count.
- `GET /api/Vet` (all vets) is unused; the richer search endpoint is used instead.
- Adopter profile `HasPetBefore` and image update fields are not represented by the current profile form.
- `ProductDetailDto.Reviews` is returned with product detail but the UI intentionally loads the complete `ProductRatings/{productId}` list instead.
- The backend returns `WelcomeMessage` on the dashboard, but the current dashboard builds its welcome/milestone copy from other real fields.

## Frontend functionality with no backend support

- Health assistant chat/history/diagnosis.
- Google sign-in/sign-up.
- Adopter request list/details and center notes display.
- Adopter appointment list/detail/reschedule and slot availability.
- Real Stripe/ShamCash/card processing.
- Notifications, invoice download, buy again, shipping address, delivery estimate, and transaction history.

## Frontend-only fixes completed

- Replaced the hardcoded cart base URL and duplicated fetch logic with the shared environment-aware API client and consistent 401 handling.
- Added real wishlist DELETE behavior; clicking an already-wishlisted product no longer sends a duplicate POST.
- Removed the product-detail fallback that silently loaded hardcoded product ID 1.
- Removed fabricated order display from order details and select the authenticated real order by `orderId`.
- Prevented missing order IDs from silently displaying the first order in history.
- Removed unsupported product-image assumptions from order view models and use a neutral receipt icon where the DTO has no image.
- Routed product review/cart mutations through the shared API behavior.
- Disabled invoice and buy-again buttons because no matching backend contract exists.
- Added explicit loading/error handling for order confirmation/details.

## Verification

- `npm run build`: passes.
- Targeted ESLint on all files changed by this audit: passes.
- Full-project `npm run lint`: still fails on pre-existing Adoption Center/Admin files outside this audit scope (`AddPetModal`, `CenterDashboard`, `Inventory`, `centerApi`, `AdminContext`) plus one existing warning.

