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
  price: number;
  size: string;
  stock: number;
  isHidden: boolean;
  productId: string;
  productImage: string;
}
