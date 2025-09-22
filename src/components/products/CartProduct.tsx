"use client";
import React, { useState } from 'react'
import { Button } from "@/src/components/ui/button";
import { Trash2, Minus, Plus, Loader2 } from "lucide-react";
import Image from "next/image";      
import Link from "next/link";  
import { formatPrice } from '@/src/helpers/currency';
import { CartProduct as CartProductI, InnerCartProduct } from "@/src/interfaces";



interface CartProductProps {
  item: CartProductI<InnerCartProduct>;
  handleRemoveCartItem: (
    productId: string,
    setIsRemovingProduct: (value: boolean) => void
  ) => void;
  handleUpdateProductCartCount: ( productId: string, 
  count: number) => void


}

export default function CartProduct({
item,
handleRemoveCartItem,
handleUpdateProductCartCount,

}: CartProductProps) {
const [IsRemovingProduct, setIsRemovingProduct] = useState(false);
const [productCount, setproductCount] =useState(item.count)
const [timeOutId, setTimeOutId] = useState<NodeJS.Timeout>();

async function handleUpdateCount(count: number) {
  setproductCount(count);

  clearTimeout(timeOutId);

  const id = setTimeout(() => {
    handleUpdateProductCartCount(item.product._id, count);
  }, 500);

  setTimeOutId(id);
}





  

  return (
      <div key={item._id} className="flex gap-4 p-4 border rounded-lg">
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src={item.product.imageCover}
                  alt={item.product.title}
                  fill
                  className="object-cover rounded-md"
                  sizes="80px"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold line-clamp-2">
                  <Link
                    href={`/products/${item.product.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {item.product.title}
                  </Link>
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.product.brand?.name}
                </p>
                <p className="font-semibold text-primary mt-2">
                  {formatPrice (item.price)}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <Button onClick={() =>
                 handleRemoveCartItem(item.product._id, setIsRemovingProduct)
                 } 
                 variant="ghost" 
                 size="sm" 
                 >
      {IsRemovingProduct ? (
        <Loader2 className="animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>

                <div className="flex items-center gap-2">
                  <Button
                  disabled={item.count == 1}
                   onClick={() => handleUpdateCount( productCount - 1)} 
                   variant="outline" 
                   size="sm"
                   >
                 
                    <Minus className="h-4 w-4" />
                  
                  </Button>
                  <span className="w-8 text-center">{productCount}</span>
                  <Button
                  disabled={item.count == item.product.quantity}
                   onClick={() => handleUpdateCount(productCount + 1)} 
                   variant="outline"
                    size="sm"
                    >
                    
                    <Plus className="h-4 w-4" />
                    
                  </Button>
                </div>
              </div>
            </div>
  )
}
