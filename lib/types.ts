export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // pence GBP
  stock: number;
  isActive: boolean;
  categorySlug: string;
  images: string[];
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

export interface Order {
  id: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  stripeSessionId: string;
  userId: string;
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
