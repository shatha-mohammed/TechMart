"use client"
import { createContext, ReactNode, useEffect, useState } from "react";
import { apiServices } from "../services/api";
import toast from "react-hot-toast";

type CartContextType = {
  cartCount?: number;
  setCartCount?: React.Dispatch<React.SetStateAction<number>>;
  isLoading?: boolean;
  handleAddToCart?: (
      productId: string,
      setAddToCartLoading: any
  
    )  => Promise<void>;
};

export const cartContext = createContext<CartContextType>({});

export default function CartContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  async function getCart() {
    setIsLoading(true);
    const response = await apiServices.getUserToCart();
    setCartCount(response.numOfCartItems);
    setIsLoading(false);
  }

  async function handleAddToCart(product:string, setAddToCartLoading:any){
  setAddToCartLoading(true)
  const data = await apiServices.addProductToCart(product);
  setCartCount(data.numOfCartItems);
  toast.success(data.message);
  setAddToCartLoading(false)
}


  useEffect(() => {
    getCart();
  }, []);
   

  return (
    <cartContext.Provider value={{ cartCount, setCartCount,isLoading, handleAddToCart }}>
      {children}
    </cartContext.Provider>
  );
}
