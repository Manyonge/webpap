export interface Order {
  amountPaid: number;
  customerName: string;
  orderTime: string;
  productName: string;
  productPhoto: string;
  orderId: string;
  isFulFilled: boolean;
}

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
  id: number | string | null;
}

export interface ShoppingCart {
  products: Product[];
  totalPrice: number;
}

export interface Order {
  customerName: string;
  customerPhoneNumber: string;
  customerEmailAddress: string;
  deliveryNotes: string;
  pickupLocation: string | null;
  pickupAgent: string | null;
  mpesaNumber: string;
}
