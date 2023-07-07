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
  name: string;
  category: string;
  condition: string;
  description: string;
  price: number;
  size: string;
  stock: number;
  isHidden: boolean;
  productId: string;
  productImage: string;
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
