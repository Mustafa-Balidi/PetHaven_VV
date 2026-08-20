import { API_BASE_URL } from "./apiClient.js";

const MOCK_LATENCY_MS = 300;

function delay(value, ms = MOCK_LATENCY_MS) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}


const MOCK_NAV_USER = {
  logoSrc:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB1isoZOydVyD5MYhvYGwVYTsmYtteNtWg89-SIig8AWCVHdHN8IzU34EjCDa4DWDt6VFxBbsg41KE1FOmvamfFJZNDGHkosK022Eh8K4IZVAFAjfdMDk08k-sUbVWYl7PrXFQuhaSeFL-8et9k6894ikaSaU_t9x2LnJ1mlreuwtp4zJa7rHufl79MX9kc62yp2E4CC8SNyC-XVLBx-WNbmQOA1JP5WO96WUk4Ll4RocbyTPOHoek4a1HSSL9fhptbUmLWo7C3zn9c",
  avatarSrc:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBVf5-FuadOrH8dn03uJxt8n3dpli9imW8s7QxXJ6Je0FQXbneDz868-6PJCOqEFD5mW9sptE5yulr3imwW4PIAimU-jiRb1YozdgIBRV6moBPZHCSPMglxo0mQzf2Mn8RjgZrbc87TnphWZTGdsnlUx_1QLsXmRDM0Lvs7qXcurQgEQGe9owNEamfugtaymWPS61LpwUdEN49IellG5MjDQv1ccPiVZJmntEb1rjNhwXFmIVg9BHQjE1pAlIUqfP8lbdVFfbJVup5l",
  cartCount: 0,
  notificationsUnread: true,
};

const MOCK_NAV_LINKS = [
  { label: "Dashboard", href: "#", active: false },
  { label: "Store", href: "#", active: true },
  { label: "Adoption", href: "#", active: false },
  { label: "Health", href: "#", active: false },
  { label: "Vet", href: "#", active: false },
];

const MOCK_HERO = {
  tag: "Spring Sale Event",
  title: "Pet Care Essentials",
  description:
    "Stock up on premium nutrition, engaging toys, and wellness products. Enjoy up to 30% off selected brands.",
  ctaLabel: "Shop Now",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBcGGkBdnqzir8FtfNsz2iSpSlAhsyMLvqGlaeheftvT1IsvZyrd-0GS6DWmkcpNpsQxt4hGrhLEoAXn_TIMlunnv0GHfbId79mpHpRqcYgJNO0vKwVveAAETkUJMIhK3FV9w4LaO57o6_64ygIHX7a0WHl3K2o9u0qz6TQifBQEiYbavw-TxIU0vlAsYixxkwMZEj1xuPMy1CcXbYpfs9o6sj7xMTZwogSSvLE6Yzazutrr0iYqw5VX9euzXEonQGpA_C4LRn_2qei",
};

const MOCK_TRUST_ITEMS = [
  { id: "shipping", icon: "local_shipping", title: "Fast, Free Delivery", desc: "On orders over $50" },
  { id: "vet", icon: "verified", title: "Vet-Approved", desc: "Expertly curated selection" },
  { id: "returns", icon: "replay", title: "Easy Returns", desc: "30-day money-back guarantee" },
];

const MOCK_FOOTER = {
  logoSrc:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDTqSx0okhbGddnCMO2ewqej-SYUclpEbHOWerf5dnKJJnyKSbOxCut7fY3sxUSfANUFUqfYUOkZ-Wzl_PIMeIBBkPAogtn_gVPygXgHDHwvhHUMyR3GEjNLKJIrqwPf6bTiAKMkiLOwG3-KON_ZK3F3pyBd-vcA4TE6inZa08js1w5y22DLJHVgjgWNXAWwJXwlEifYqVZ3Em_Ajsd7JtDGxtfLovDWgo1VGV_wJ08ZjitcyYHsi0-4NU1jdRVF57SmF58BmK78J7m",
  copyText: "© 2024 Pet Haven. All rights reserved.",
  links: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Contact Us", href: "#" },
  ],
};

// ─── "Endpoints" ───────────────────────────────────────────
const STORE_CATALOG_BASE_URL = `${API_BASE_URL}/StoreCatalog`;
const RATINGS_BASE_URL = `${API_BASE_URL}/ProductRatings`;

const CATEGORY_ICONS = {
  Food: "restaurant",
  Toys: "smart_toy",
  Medicine: "medical_services",
  Accessories: "bed",
};

export async function getNavData() {
  return delay({ user: MOCK_NAV_USER, links: MOCK_NAV_LINKS });
}
export async function getFooterData() {
  return delay(MOCK_FOOTER);
}
export async function getHeroBanner() {
  return delay(MOCK_HERO);
}
export async function getTrustItems() {
  return delay(MOCK_TRUST_ITEMS);
}

export async function getCategories() {
  const res = await fetch(`${STORE_CATALOG_BASE_URL}/Categories`);

  if (!res.ok) {
    throw new Error(`erorr fetching data ${res.status}`);
  }

  const json = await res.json();

  if (!json.success) {
    throw new Error("failed");
  }

  return json.data.map((cat) => ({
    id: cat.categoryId,
    label: cat.name,
    description: cat.description,
    icon: CATEGORY_ICONS[cat.name] || "category", 
  }));
}



export async function getProductRatings(productId) {
  const res = await fetch(`${RATINGS_BASE_URL}/${productId}`);

  if (!res.ok) {
    throw new Error(`erorr fetching data${productId}: ${res.status}`);
  }

  const json = await res.json();

  if (!json.success) {
    throw new Error("failed");
  }

  return json.data; 
}

function summarizeRatings(ratingsArray) {
  if (!ratingsArray || ratingsArray.length === 0) {
    return { rating: null, reviewCount: 0 };
  }

  const total = ratingsArray.reduce((sum, rating) => sum + Number(rating.rating ?? 0), 0);
  const average = total / ratingsArray.length;

  return {
    rating: Math.round(average * 10) / 10,
    reviewCount: ratingsArray.length,
  };
}

const ORDERS_BASE_URL = `${API_BASE_URL}/Orders`;

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getRecentOrders() {
  try {
    const res = await fetch(`${ORDERS_BASE_URL}/my-orders`, {
      headers: {
        Accept: "*/*",
        ...getAuthHeaders(),
      },
    });

    if (res.status === 401) {
      console.warn("must be loggged in");
      return []; 
    }

    if (!res.ok) {
      console.warn(`erorr fetching data: ${res.status}`);
      return [];
    }

    const json = await res.json();

    if (!json.success) {
      console.warn("failed");
      return [];
    }

    return json.data.map((order) => ({
      id: order.orderId ?? order.id,
      image: order.image ?? order.imageUrl,
      status: order.status,
      statusColor: order.statusColor ?? "green",
      date: order.date ?? order.createdAt,
    }));
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    return [];
  }
}




export async function getProducts({ page = 1, sort = "popular", filters = {} } = {}) {
  const res = await fetch(`${STORE_CATALOG_BASE_URL}/Products`);

  if (!res.ok) {
    throw new Error(`erorr fetching data: ${res.status}`);
  }

  const json = await res.json();

  if (!json.success) {
    throw new Error("failed");
  }

  const ratingsResults = await Promise.all(
    json.data.map((item) =>
      getProductRatings(item.productId).catch(() => []) 
    )
  );

  const mappedProducts = json.data.map((item, index) => {
    const hasDiscount = item.discountRate > 0;
    const { rating, reviewCount } = summarizeRatings(ratingsResults[index]);

    return {
      id: item.productId,
      centerId: item.centerId,
      brand: item.centerName,
      title: item.name,
      description: item.description,
      image: item.imageUrl,
      stockQuantity: item.stockQuantity,
      categoryId: item.categoryId,
      categoryName: item.categoryName,

      rating,
      reviewCount,

      price: hasDiscount ? item.priceAfterDiscount : item.productPrice,
      oldPrice: hasDiscount ? item.productPrice : null,

      badge: hasDiscount
        ? { label: `Save ${Math.round(item.discountRate * 100)}%`, variant: "red" }
        : item.stockQuantity <= 5
          ? { label: "Low Stock", variant: "orange" }
          : null,
    };
  });

  const availableBrands = [...new Set(mappedProducts.map((product) => product.brand).filter(Boolean))]
    .sort((first, second) => first.localeCompare(second));
  const selectedBrands = Array.isArray(filters.brands) ? filters.brands : [];
  const minPrice = filters.minPrice === "" ? null : Number(filters.minPrice);
  const maxPrice = filters.maxPrice === "" ? null : Number(filters.maxPrice);

  const filteredProducts = mappedProducts.filter((product) => {
    const matchesCategory = !filters.categoryId || product.categoryId === filters.categoryId;
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const matchesMin = minPrice === null || !Number.isFinite(minPrice) || product.price >= minPrice;
    const matchesMax = maxPrice === null || !Number.isFinite(maxPrice) || product.price <= maxPrice;

    return matchesCategory && matchesBrand && matchesMin && matchesMax;
  });

  const sortedProducts = [...filteredProducts].sort((first, second) => {
    if (sort === "price-asc") return first.price - second.price;
    if (sort === "price-desc") return second.price - first.price;
    if (sort === "rating") return (second.rating ?? 0) - (first.rating ?? 0);
    if (sort === "newest") return Number(second.id) - Number(first.id);

    return (second.reviewCount ?? 0) - (first.reviewCount ?? 0);
  });

  const resultsPerPage = 12;
  const totalResults = sortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / resultsPerPage));
  const start = (page - 1) * resultsPerPage;
  const pageItems = sortedProducts.slice(start, start + resultsPerPage);

  return {
    products: pageItems,
    pagination: {
      currentPage: page,
      totalPages,
      totalResults,
      resultsPerPage,
    },
    filterOptions: {
      brands: availableBrands,
    },
  };
}




export async function addToCart(productId, quantity = 1) {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('you must be logged in');
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/Cart/Add`, {
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity }),
    });
  } catch {
    throw new Error('failed');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('server error');
  }

  if (!response.ok || !data.success) {
    throw new Error(data?.message || 'erorr adding to wishlist');
  }

  return data;
}

export async function toggleWishlist(productId) {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('you must be logged in');
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/Wishlist/${productId}`, {
      method: 'POST',
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new Error('failed');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('server erorr');
  }

  if (!response.ok || !data.success) {
    throw new Error(data?.message || 'erorr adding to wishlist');
  }

  return data;
}
