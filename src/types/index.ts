export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: "CEMENT" | "STEEL";
  brand: string;
  variant: string | null;
  price: number;
  unit: string;
  stock: number;
  minimumStock: number;
  image: string | null;
  active: boolean;
}

export interface CartItem {
  productId: string;
  name: string;
  brand: string;
  variant: string | null;
  price: number;
  unit: string;
  quantity: number;
  image: string | null;
  stock: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  brand: string;
  variant: string | null;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  whatsapp: string | null;
  deliveryAddress: string;
  houseNumber: string | null;
  street: string | null;
  area: string | null;
  city: string;
  district: string | null;
  state: string;
  pincode: string;
  additionalInstructions: string | null;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
}

export interface Settings {
  id: string;
  businessName: string;
  phone: string;
  whatsapp: string;
  location: string;
  address: string | null;
  openingHours: string | null;
  deliveryCharge: number;
  minimumOrderValue: number;
  logo: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
