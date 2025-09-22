"use client";

import { useState, useEffect } from "react";
import { WishlistItem, Product, Brand, Category } from "@/src/interfaces";
import { ProductCard } from "@/src/components/products/ProductCard";
import { LoadingSpinner } from "@/src/components";
import { Button } from "@/src/components/ui/button";
import { Grid, List, Heart } from "lucide-react";
import { useWishlist } from "@/src/context/WishlistContext";
import Link from "next/link";

const createProductFromWishlistItem = (item: WishlistItem): Product => {
  const defaultBrand: Brand = {
    _id: item.product.brand?._id || 'unknown',
    name: item.product.brand?.name || 'Unknown',
    slug: 'unknown',
    image: ''
  };

  const defaultCategory: Category = {
    _id: item.product.category?._id || 'unknown',
    name: item.product.category?.name || 'Unknown',
    slug: 'unknown'
  };

  return {
    _id: item.product._id,
    id: item.product._id,
    title: item.product.title,
    slug: item.product.title.toLowerCase().replace(/\s+/g, '-'),
    imageCover: item.product.imageCover,
    price: item.product.price,
    brand: defaultBrand,
    category: defaultCategory,
    description: "",
    ratingsAverage: 0,
    ratingsQuantity: 0,
    sold: 0,
    quantity: 0,
    images: [],
    subcategory: [],
    createdAt: "",
    updatedAt: "",
  };
};

export default function WishlistPage() {
  const { wishlist, isLoading, removeFromWishlist } = useWishlist();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">My Wishlist</h1>
        <p className="text-muted-foreground">
          Save items you love for later
        </p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} in your wishlist
        </p>
        <div className="flex items-center border rounded-md">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="rounded-r-none"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="rounded-l-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Wishlist Items */}
      {wishlist.length > 0 ? (
        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              : "grid-cols-1"
          }`}
        >
          {wishlist.map((item) => {
            if (!item || !item.product) {
              console.error('Invalid wishlist item:', item);
              return null;
            }

            return (
              <div key={item._id} className="relative">
        <ProductCard 
          product={createProductFromWishlistItem(item)}
          viewMode={viewMode}
        />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={() => removeFromWishlist(item.product._id)}
                >
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
          <p className="text-muted-foreground mb-4">
            Save items you love by clicking the heart icon on any product.
          </p>
          <Button asChild>
            <Link href="/products">
              Start Shopping
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
