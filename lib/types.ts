export interface MediaItem {
  type: "image" | "video" | "youtube" | "vimeo";
  url: string;
  thumbnailUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // pence GBP
  stock: number;
  isActive: boolean;
  isArchived?: boolean;
  categorySlug: string;
  images: string[];
  media?: MediaItem[];
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  shippingAddress?: ShippingAddress;
  notes?: string;
  source?: "checkout" | "payment_link";
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  stripeSessionId: string;
  userId: string;
  createdAt: Date;
}

export interface PaymentLink {
  id: string;
  stripePaymentLinkId: string;
  url: string;
  productName: string;
  amountPence: number;
  active: boolean;
  createdAt: Date;
}

export interface UserDoc {
  name: string;
  email: string;
  role: "customer" | "admin";
  createdAt: Date;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Review {
  id: string;
  productId: string;
  authorName: string;
  rating: number; // 1-5
  body: string;
  isApproved: boolean;
  createdAt: Date;
}
