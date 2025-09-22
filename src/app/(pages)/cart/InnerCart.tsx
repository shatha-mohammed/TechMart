"use client";
import { Button } from '@/src/components';
import CartProduct from '@/src/components/products/CartProduct';
import { formatPrice } from '@/src/helpers/currency';
import { GetUserCartResponse } from '@/src/interfaces';
import { apiServices } from '@/src/services/api';
import { Separator } from '@radix-ui/react-separator';
import {  Loader2, Trash2 } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import Link from "next/link";
import { useContext, useEffect } from "react";
import { cartContext } from "@/src/context/CartContext";

interface InnerCartProps {
  cartData: GetUserCartResponse;
}

export default function InnerCart({cartData}: InnerCartProps ) {

const [innerCartData, setInnerCartData] =
    useState<GetUserCartResponse>(cartData);
const [isClearingCart, setIsClearingCart] = useState(false);
const { setCartCount } = useContext(cartContext);
const [checkoutLoading, setCheckoutLoading] = useState(false);

async function handleCheckout() {
  setCheckoutLoading(true);
  window.location.href = "/payment";
  setCheckoutLoading(false);
}
useEffect(() => {
  setCartCount!(innerCartData.numOfCartItems);
}, [innerCartData]);

   async function handleRemoveCartItem(
  productId: string,
  setIsRemovingProduct: (value: boolean) => void
) {
  setIsRemovingProduct(true);
  const response = await apiServices.removeCartProduct(productId);
  console.log("🚀 ~ handleRemoveCartItem ~ response:", response);
  toast.success("Product removed successfully", {
    position: "bottom-right",
  });
  setIsRemovingProduct(false);

  const newCartData: GetUserCartResponse = await apiServices.getUserToCart();
  setInnerCartData(newCartData);
}
async function handleClearCart() {
    setIsClearingCart(true)
  const response = await apiServices.clearCart();
  setIsClearingCart(false)
  const newCartData = await apiServices.getUserToCart();
  setInnerCartData(newCartData);
}

async function handleUpdateProductCartCount(
  productId: string, 
  count: number
) {
  const response = await apiServices.updateCartProductCount(productId, count);
  const newCartData = await apiServices.getUserToCart();
  setInnerCartData(newCartData);
  console.log("🚀 ~ handleUpdateProductCartCount ~ response:", response);
}


  return (
   <>
    {/* Header */}
       <div className="mb-8">
         <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
        {innerCartData.numOfCartItems > 0 &&( <p className="text-muted-foreground">
           {innerCartData.numOfCartItems} item
           {innerCartData.numOfCartItems > 1 ? "s" : ""} in your cart
         </p>
         )}
       </div>
   
      { innerCartData.numOfCartItems > 0 ?( <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Cart Items */}
         <div className="lg:col-span-2">
           <div className="space-y-4">
        {innerCartData.data.products.map((item, index) => (
   <CartProduct 
     key={item._id || index} // <-- هنا
     handleRemoveCartItem={handleRemoveCartItem} 
     item={item}
     handleUpdateProductCartCount={handleUpdateProductCartCount}
   />
))}
           </div>
         </div>
   {/* Clear Cart */}
<div className="mt-6">
  <Button  disabled={isClearingCart}  
  onClick={handleClearCart} 
  variant="outline">
  { isClearingCart ? <Loader2 className='animate-spin mr-2'/> 
  : <Trash2 className="h-4 w-4 mr-2" />}
    Clear Cart
  </Button>
</div>
         {/* Order Summary */}
         <div className="lg:col-span-1">
           <div className="border rounded-lg p-6 sticky top-4">
             <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
   
             <div className="space-y-2 mb-4">
               <div className="flex justify-between">
                 <span>Subtotal ({cartData.numOfCartItems} items)</span>
                 <span>{formatPrice(cartData.data.totalCartPrice)}</span>
               </div>
               <div className="flex justify-between">
                 <span>Shipping</span>
                 <span className="text-green-600">Free</span>
               </div>
             </div>
   
             <Separator className="my-4" />
   
             <div className="flex justify-between font-semibold text-lg mb-6">
               <span>Total</span>
               <span>{formatPrice(cartData.data.totalCartPrice)}</span>
             </div>
   
         <Button
  disabled={checkoutLoading}
  onClick={handleCheckout}
  className="w-full"
  size="lg"
>
  {checkoutLoading && <Loader2 className="animate-spin" />}
  Proceed to Checkout
</Button>
   
             <Button variant="outline" className="w-full mt-2" asChild>
               <Link href="/products">Continue Shopping</Link>
             </Button>
           </div>
         </div>
       </div>
   ):(
    <div className='text-center'>
        <h2 className='text-xl font-semibold mb-4 text-gray-700'> 
            No products in your Cart
       </h2>
      <Button variant="outline" className="w-fit mt-2" asChild>
               <Link href="/products">Add ones</Link>
      </Button>
    </div>
   
           ) }
   </>
  );
}


