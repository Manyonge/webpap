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
  passportPhoto?: File | string;
  businessLogo?: File | string;
  fullName: string;
  phoneNumber: string;
  idNumber: string;
  businessName: string;
  loginEmail: string;
  password?: string;
  walletBalance: number;
  id: number | string | null;
}

export interface Customer {
  name: string;
  phoneNumber: string;
  emailAddress: string;
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
  storeFrontId: string;
  retailerId: string;
  product: Product;
  customer: Customer;
  delivery: Delivery;
}
