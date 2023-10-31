export interface Product {
  retailerId: string;
  storeFrontId: string;
  name: string;
  category: string;
  condition: string;
  description: string;
  price: number;
  size: string;
  stock: number | string;
  isHidden: boolean;
  id: number | string;
  productImages: { url: string; fileName: string }[];
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
  customerName: string;
  customerPhoneNumber: string;
  customerEmailAddress: string;
  mpesaNumber: string;
  deliveryNotes: string;
  pickupAgent: string;
  pickupLocation: string;
}
export interface Order {
  id?: number;
  storefront_id?: string;
  retailer_id?: string;
  product: Product;
  customer: Customer;
  delivery: Delivery;
  is_fulfilled: boolean;
  created_at?: string;
}

export interface Transaction {
  transaction_type: string;
  transaction_date: string;
  amount: number;
  storefront_id?: string;
  retailer_id?: string;
}
