"use client";

import { useState, useEffect, useContext, useCallback } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { LoadingSpinner } from "@/src/components/shared/LoadingSpinner";
import {  Heart, Truck, Shield, RotateCcw } from "lucide-react";
import Link from "next/link";
import { renderStars } from "@/src/helpers/rating";
import { Product } from "@/src/interfaces";
import {SingleProductResponse} from "@/src/types/responses"
import { formatPrice } from "@/src/helpers/currency";
import { apiServices } from "@/src/services/api";
import AddToCartButton from "@/src/components/products/AddToCartButton";
import { cartContext } from "@/src/context/CartContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState <Product| null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const[addToCartLoading, setAddToCartLoading] =useState(false)
  const { handleAddToCart } = useContext(cartContext);
 
  const fetchProductDetails = useCallback(async () => {
    if (!id) {
      setError("Missing product id");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data: SingleProductResponse = await apiServices.getProductDetails(String(id));
      setProduct(data.data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load product";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Product not found"}</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const gallery = Array.isArray(product.images) ? product.images : [];
  const mainImage = gallery[selectedImage] || product.imageCover || "/placeholder.png";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg border">
            <Image
              src={mainImage}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Thumbnail Images */}
          {gallery.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {gallery.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Brand */}
          <div className="text-sm text-muted-foreground uppercase tracking-wide">
            {product.brand ? (
              <Link
                href={`/brands/${product.brand._id}`}
                className="hover:text-primary hover:underline transition-colors"
              >
                {product.brand.name}
              </Link>
            ) : (
              <span className="text-muted-foreground">N/A</span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold">{product.title}</h1>

          {/* Rating */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {renderStars(5)}
              <span className="ml-2 text-sm text-muted-foreground">
                {product.ratingsAverage} ({product.ratingsQuantity} reviews)
              </span>
            </div>
            <span className="text-sm text-muted-foreground">{product.sold} sold</span>
          </div>

          {/* Price */}
          <div className="text-3xl font-bold text-primary">
            {formatPrice(product.price)}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-semibold">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Category & Subcategory */}
          <div className="flex flex-wrap gap-2">
            {product.category ? (
              <Link
                href={`/categories/${product.category._id}`}
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-secondary/80 transition-colors"
              >
                {product.category.name}
              </Link>
            ) : (
              <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
                N/A
              </span>
            )}
            {product.subcategory && product.subcategory.map((sub) => (
              <span
                key={sub._id}
                className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
              >
                {sub.name}
              </span>
            ))}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Stock:</span>
            <span
              className={`text-sm ${
                product.quantity > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.quantity > 0
                ? `${product.quantity} available`
                : "Out of stock"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <AddToCartButton
    addToCartLoading={addToCartLoading}
            handleAddToCart={() =>handleAddToCart!(product._id, setAddToCartLoading)}
    productQuantity={product.quantity}
  />
            <Button variant="outline" size="lg">
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Free Shipping</p>
                <p className="text-xs text-muted-foreground">
                  On orders over $50
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Secure Payment</p>
                <p className="text-xs text-muted-foreground">
                  100% secure checkout
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Easy Returns</p>
                <p className="text-xs text-muted-foreground">
                  30-day return policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}