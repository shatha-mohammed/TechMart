export interface WishlistItem {
  _id: string;
  user: string;
  product: {
    _id: string;
    title: string;
    imageCover: string;
    price: number;
    brand: {
      _id: string;
      name: string;
    };
    category: {
      _id: string;
      name: string;
    };
  };
  createdAt: string;
}

export interface WishlistResponse {
  status: string;
  results: number;
  data: WishlistItem[];
}

export interface AddToWishlistResponse {
  status: string;
  data: WishlistItem;
}

export interface RemoveFromWishlistResponse {
  status: string;
  message: string;
}
