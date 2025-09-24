"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/src/interfaces";
import { Button } from "@/src/components/ui/button";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { renderStars } from "@/src/helpers/rating";
import { formatPrice } from "@/src/helpers/currency";
import { useContext, useState } from "react";
import { apiServices } from "@/src/services/api";
import AddToCartButton from "./AddToCartButton";
import { cartContext } from "@/src/context/CartContext";
import { useWishlist } from "@/src/context/WishlistContext";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {

 const [addToCartLoading, setAddToCartLoading] = useState<boolean>(false);
 const {  handleAddToCart } = useContext(cartContext);
 const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

 // Safety check for product data
 if (!product || !product._id) {
   console.error('Invalid product data:', product);
   return null;
 }
 


  if (viewMode === "list") {
    return (
      <div className="flex gap-4 p-6 card-colorful hover-lift">
        <div className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden shadow-primary">
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-110"
            sizes="128px"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-2">
              <Link
                href={`/products/${product.id}`}
                className="hover:text-gradient transition-all duration-300"
              >
                {product.title}
              </Link>
            </h3>
            <Button 
              variant="ghost" 
              size="sm"
              className="hover:gradient-secondary hover:text-white transition-all duration-300"
              onClick={() => isInWishlist(product._id) ? removeFromWishlist(product._id) : addToWishlist(product._id)}
            >
              <Heart 
                className={`h-4 w-4 ${isInWishlist(product._id) ? 'fill-red-500 text-red-500' : ''}`} 
              />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              {renderStars(product.ratingsAverage)}
              <span className="text-sm text-muted-foreground ml-1">
                ({product.ratingsQuantity})
              </span>
            </div>

            <span className="text-sm text-muted-foreground">
              {product.sold} sold
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold text-gradient">
                {formatPrice(product.price)}
              </span>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  Brand:{" "}
                  {product.brand ? (
                    <Link
                      href={`/brands/${product.brand._id}`}
                      className="hover:text-gradient hover:underline transition-all duration-300"
                    >
                      {product.brand.name}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </span>
                <span>
                  Category:{" "}
                  {product.category ? (
                    <Link
                      href={`/categories/${product.category._id}`}
                      className="hover:text-gradient hover:underline transition-all duration-300"
                    >
                      {product.category.name}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </span>
              </div>
            </div>

            <Button className="btn-gradient">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    );
  } 

  return (
    <div className="group relative flex flex-col justify-between card-colorful hover-lift">
      <div className="">
        {/* Product Image */}
      <div className="relative aspect-square overflow-hidden rounded-t-xl">
        <Image
          src={product.imageCover}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 glass hover:gradient-secondary hover:text-white"
          onClick={() => isInWishlist(product._id) ? removeFromWishlist(product._id) : addToWishlist(product._id)}
        >
          <Heart 
            className={`h-4 w-4 ${isInWishlist(product._id) ? 'fill-red-500 text-red-500' : ''}`} 
          />
        </Button>

        {/* Badge for sold items */}
        {product.sold > 100 && (
          <div className="absolute top-3 left-3 gradient-accent text-white text-xs px-3 py-1 rounded-full shadow-accent font-medium">
            Popular
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand */}
        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
          {product.brand ? (
            <Link
              href={`/brands/${product.brand._id}`}
              className="hover:text-gradient hover:underline transition-all duration-300"
            >
              {product.brand.name}
            </Link>
          ) : (
            <span className="text-muted-foreground">N/A</span>
          )}
        </p>

        {/* Title */}
        <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-gradient transition-all duration-300">
          <Link href={`/products/${product.id}`}>{product.title}</Link>
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">{renderStars(product.ratingsAverage)}</div>
          <span className="text-xs text-muted-foreground">
            ({product.ratingsQuantity})
          </span>
        </div>

        {/* Category */}
        <p className="text-xs text-muted-foreground mb-2">
          {product.category ? (
            <Link
              href={`/categories/${product.category._id}`}
              className="hover:text-gradient hover:underline transition-all duration-300"
            >
              {product.category.name}
            </Link>
          ) : (
            <span className="text-muted-foreground">N/A</span>
          )}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-gradient">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-muted-foreground">{product.sold} sold</span>
        </div>
      </div>
      </div>

        {/* Add to Cart Button */}
      <div className="p-4">
       
        <AddToCartButton
            addToCartLoading={addToCartLoading}
            handleAddToCart={() =>handleAddToCart!(product._id, setAddToCartLoading)}
            productQuantity={product.quantity}
          />
      </div>
      </div>
    
  );
}