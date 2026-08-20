import { apiRequest } from './apiClient';

// ── Response mappers ──────────────────────────────────────
// The backend DTOs only expose a subset of the fields the Stitch UI
// expects. These mappers translate real backend shapes into the shape
// the components read, without inventing data for fields the backend
// does not provide (those are left undefined so the UI renders an
// empty/dash state instead of fake content).

function mapPet(p) {
  if (!p) return p;
  return {
    ...p,
    breed: p.breed ?? '',
    image: p.imageUrl ?? p.image ?? null,
  };
}

function mapCenterProfile(profile) {
  if (!profile) return profile;
  return {
    ...profile,
    centerName: profile.centerName ?? '',
    phoneNumber: profile.phoneNumber ?? '',
    address: profile.address ?? '',
    // The current center update API persists this value as ContactInfo.
    licenseNumber: profile.licenseNumber ?? profile.contactInfo ?? '',
    profileImage: profile.profileImageUrl ?? profile.profileImage ?? null,
  };
}

function mapAdoptionRequest(r) {
  return {
    ...r,
    id: r.requestId,
    status: r.status,
    score: r.score,
    appliedDate: r.requestDate ? String(r.requestDate).slice(0, 10) : '',
    // Backend (AdoptionRequestResponseDto) does not return applicant
    // contact info, motivation text, verification/reference data, or
    // pet photo/breed/age/gender for a request — left undefined here
    // rather than fabricated. See audit report.
    pet: { name: r.petName },
    applicant: { name: r.adopterName },
  };
}

function mapReport(r) {
  return {
    ...r,
    id: r.reportId,
    adopterId: r.adopterId,
    petName: r.petName,
    adopterName: r.adopterName,
    healthCondition: r.healthStatus,
    quote: r.notes,
    submittedDate: r.createdAt ? String(r.createdAt).slice(0, 10) : '',
    // Backend has no adopter avatar in PetReportResponseDto.
    adopterImage: undefined,
  };
}

function mapOrder(o) {
  return {
    ...o,
    id: o.orderId,
    total: o.totalAmount,
    items: Array.isArray(o.items) ? o.items.length : 0,
    // Backend (OrderResponseDto) does not return a buyer/customer name.
    customer: undefined,
  };
}

function mapBlacklistEntry(entry) {
  return {
    id: entry.blacklistId,
    adopterName: entry.adopterName,
    reason: entry.reason,
    banDate: entry.banDate,
    isActive: entry.isActive,
  };
}

// ── Profile ─────────────────────────────────────────────
export async function getCenterProfile() {
  const profile = await apiRequest('/Profile/me');
  return mapCenterProfile(profile);
}
export async function updateCenterProfile(dto) {
  await apiRequest('/Profile/update/center', {
    method: 'PUT',
    body: JSON.stringify({
      centerName: dto.centerName,
      contactInfo: dto.licenseNumber ?? dto.contactInfo ?? null,
      address: dto.address,
      phoneNumber: dto.phoneNumber,
      imageUrl: dto.profileImageUrl ?? null,
    }),
  });
  return getCenterProfile();
}

// ── Dashboard ────────────────────────────────────────────
export async function getDashboardStats() {
  return apiRequest('/CenterDashboard/stats');
}
export async function getLatestOrders(count = 5) {
  const orders = await apiRequest(`/CenterDashboard/orders?count=${count}`);
  return (orders ?? []).map(mapOrder);
}

// RecentAdoptionDto/RecentProductSaleDto carry no id — derive a stable
// React key from the real fields instead of inventing one.
export async function getRecentAdoptions() {
  const items = await apiRequest('/CenterDashboard/recent-adoptions');
  return (items ?? []).map((a, i) => ({
    id: `${a.petName}-${a.adoptedDate}-${i}`,
    petName: a.petName,
    image: a.petImageUrl,
    date: a.adoptedDate ? String(a.adoptedDate).slice(0, 10) : '',
  }));
}
export async function getRecentSales(count = 3) {
  const items = await apiRequest(`/CenterDashboard/recent-sales?count=${count}`);
  return (items ?? []).map((s, i) => ({
    id: `${s.productName}-${s.soldDate}-${i}`,
    name: s.productName,
    image: s.productImageUrl,
    when: s.soldDate ? String(s.soldDate).slice(0, 10) : '',
    price: s.price,
  }));
}

// TODO: backend endpoint missing
export async function getRecentActivity() { return []; }
// TODO: backend endpoint missing (AdoptionCenter has no wallet/balance)
export async function getWallet() { return { balance: 0, currency: 'USD', transactions: [] }; }

// ── Product Reviews ───────────────────────────────────────
export async function getCenterProductReviews() {
  const data = await apiRequest('/ProductRatings/CenterReviews');
  const reviews = (data?.reviews ?? []).map((review) => ({
    id: review.ratingId,
    productId: review.productId,
    productName: review.productName,
    name: review.adopterName,
    initials: review.adopterName
      ?.split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "—",
    rating: review.rating,
    text: review.comment,
    createdAt: review.createdAt,
  }));

  return {
    reviews,
    reviewStats: {
      average: Number(data?.averageRating ?? 0),
      total: Number(data?.totalReviews ?? 0),
      breakdown: data?.breakdown ?? [],
    },
  };
}

// ── Adoption Inventory (Pets) ─────────────────────────────
export async function getAdoptionInventory() {
  const pets = await apiRequest('/Pets/CenterPets');
  return (pets ?? []).map(mapPet);
}
export async function addAnimal(dto) {
  const created = await apiRequest('/Pets/CreateCenterPet', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
  return mapPet(created);
}
export async function updateAnimalStatus(id, dto) {
  const updated = await apiRequest(`/Pets/UpdateCenterPet/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dto),
  });
  return mapPet(updated);
}
export async function deleteAnimal(id) {
  return apiRequest(`/Pets/DeleteCenterPet/${id}`, { method: 'DELETE' });
}
// TODO: backend endpoint missing (no "all adoptions" list, only a
// Take(3) recent-adoptions endpoint)
export async function getAllRecentAdoptions() { return []; }

// ── Product Inventory ─────────────────────────────────────
export async function getProductInventory() {
  return apiRequest('/StoreCatalog/CenterProducts');
}
export async function getCategories() {
  return apiRequest('/StoreCatalog/Categories');
}
export async function addProduct(dto) {
  return apiRequest('/StoreCatalog/AddProduct', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}
export async function updateProduct(id, dto) {
  return apiRequest(`/StoreCatalog/UpdateProduct/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dto),
  });
}
export async function deleteProduct(id) {
  return apiRequest(`/StoreCatalog/DeleteProduct/${id}`, { method: 'DELETE' });
}
// TODO: backend endpoint missing (no per-center full sales list, and
// no buyer name is returned by any sales-related DTO)
export async function getAllProductSales() { return []; }

// ── Monthly Reports ───────────────────────────────────────
export async function getMonthlyReports() {
  const reports = await apiRequest('/PetReports/CenterReports');
  return {
    submitted: (reports ?? []).map(mapReport),
    // Backend has no "pets due for a report" endpoint.
    dueForReport: [],
  };
}
export async function addReport(dto) {
  const created = await apiRequest('/PetReports', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
  return mapReport(created);
}
// Backend has no resolve/close/approve/delete endpoint for pet
// reports (PetReportsController only exposes SubmitReport +
// CenterReports). Throwing here (instead of silently no-opping) lets
// the existing optimistic-update rollback in CenterContext revert the
// UI instead of faking a success that the server never performed.
export async function deleteReport(_id) {
  throw new Error('Resolving pet reports is not supported by the backend yet.');
}

// ── Adoption Requests ─────────────────────────────────────
export async function getAdoptionRequests() {
  const requests = await apiRequest('/Adoption/CenterRequests');
  return (requests ?? []).map(mapAdoptionRequest);
}
// RespondToRequest returns only { success, message } — no request data —
// so these resolve to a small status patch that the caller shallow-merges
// onto the existing (already-mapped) request instead of replacing it.
export async function approveRequest(id) {
  await apiRequest(`/Adoption/Respond/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status: 'Approved' }),
  });
  return { status: 'Approved' };
}
export async function rejectRequest(id, reason) {
  await apiRequest(`/Adoption/Respond/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status: 'Rejected', centerNote: reason }),
  });
  return { status: 'Rejected', centerNote: reason };
}

// The list response intentionally exposes only blacklist record data.
// It does not include AdopterId, so Ban/Unban cannot be connected safely.
export async function getCenterBlacklist() {
  const entries = await apiRequest('/Blacklist/CenterBlacklist');
  return (entries ?? []).map(mapBlacklistEntry);
}

export async function banAdopter({ adopterId, reason }) {
  const normalizedAdopterId = Number(adopterId);
  const normalizedReason = reason?.trim();
  if (!Number.isInteger(normalizedAdopterId) || normalizedAdopterId <= 0) {
    throw new Error('A valid adopter ID is required.');
  }
  if (!normalizedReason) throw new Error('A block reason is required.');

  return apiRequest('/Blacklist/BanAdopter', {
    method: 'POST',
    body: JSON.stringify({ adopterId: normalizedAdopterId, reason: normalizedReason }),
  });
}
