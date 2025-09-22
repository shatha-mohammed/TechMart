import React from "react";
import { Button } from "../ui";
import { Loader2, ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  productQuantity: number;
  addToCartLoading: boolean;
  handleAddToCart: () => void;
}

export default function AddToCartButton({
  productQuantity,
  addToCartLoading,
  handleAddToCart,
}: AddToCartButtonProps) {
  return (
    <Button
      size="lg"
      className="flex-1"
      disabled={productQuantity === 0 || addToCartLoading}
      onClick={handleAddToCart}
    >
      {addToCartLoading && <Loader2 className="animate-spin" />}
      <ShoppingCart className="h-5 w-5 mr-2" />
      Add to Cart
    </Button>
  );
}
