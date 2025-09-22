export interface Order {
  _id: string;
  user: string;
  cart: {
    _id: string;
    products: OrderProduct[];
    totalPrice: number;
  };
  shippingAddress: {
    details: string;
    phone: string;
    city: string;
  };
  paymentMethod: string;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderProduct {
  count: number;
  price: number;
  product: {
    _id: string;
    title: string;
    imageCover: string;
    price: number;
  };
}

export interface CreateOrderRequest {
  shippingAddress: {
    details: string;
    phone: string;
    city: string;
  };
  paymentMethod: string;
}

export interface OrdersResponse {
  status: string;
  results: number;
  data: Order[];
}

export interface SingleOrderResponse {
  status: string;
  data: Order;
}
