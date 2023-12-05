export interface Product {
  retailer_id: string;
  storefront_id: string;
  name: string;
  category: string;
  condition: string;
  description: string;
  price: number;
  size: string;
  stock: number;
  is_hidden: boolean;
  id: number | string;
  product_images: { url: string; file_name: string }[];
}

export interface Size {
  size: string;
  id: number;
}

export interface Category {
  category: string;
  id: number;
}

export interface Condition {
  condition: string;
  id: number;
}

export interface CartItem {
  product: Product;
  orderId: string;
  quantity: number;
}

export interface Retailer {
  [index: string]: any;
  passport_photo?: File | string;
  business_logo?: File | string;
  full_name: string;
  phone_number: string;
  id_number: string;
  business_name: string;
  login_email: string;
  password?: string;
  instagram_handle: string;
  wallet_balance: number;
  id: number | string | null;
}

export interface Withdrawal {
  amount: number;
  mpesaNumber: string;
  mpesaName: string;
}

export interface Customer {
  name: string;
  phone_number: string;
  email_address: string;
  storefront_id: string;
  retailer_id: string;
}

export interface Delivery {
  pickupLocation: string;
  pickupAgent: string;
}

export interface ShoppingCart {
  products: Product[];
  totalPrice: number;
}

export interface CheckOut {
  name: string | null | undefined;
  phoneNumber: string | null | undefined;
  email: string | null | undefined;
  deliveryFee: number | null | undefined;
  instagramHandle?: string | null | undefined;
  deliveryNotes?: string | null | undefined;
  agentName?: string | null | undefined;
  agentLocation?: string | null | undefined;
  outsideLocation?: string | null | undefined;
  outsideCourier?: string | null | undefined;
  products: Product[] | null | undefined;
  totalPrice: number | null | undefined;
  retailerId: string | null | undefined;
  storeFrontId: string | null | undefined;
}
export interface Order {
  id: number;
  created_at: string;
  retailer_id: string;
  storefront_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_instagram: string;
  is_fulfilled: boolean;
  products: any[];
  delivery_option: string;
  agent_name: string;
  agent_location: string;
  outside_location: string;
  outside_courier: string;
  delivery_fee: number;
  total_price: number;
}

export interface Transaction {
  transaction_type: string;
  transaction_date: string;
  amount: number;
  storefront_id?: string;
  retailer_id?: string;
}
