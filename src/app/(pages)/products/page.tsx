"use client";

import { useState, useEffect } from "react";
import { Product } from "@/src/interfaces";
import { ProductCard } from "@/src/components/products/ProductCard";
import { LoadingSpinner } from "@/src/components";
import { Button } from "@/src/components/ui/button";
import {  Grid, List } from "lucide-react";
import { ProductsResponse } from "@/src/types/responses";
import { apiServices } from "@/src/services/api";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");


  async function fetchProducts() {
    setLoading(true);
    try {
      const data: ProductsResponse = await apiServices.getAllProducts();
      console.log('Products API Response:', data);
      if (data && data.data) {
        setProducts(data.data);
      } else {
        console.error('Invalid products data structure:', data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);



  if (loading && products.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Products</h1>
        <p className="text-muted-foreground">
          Discover amazing products from our collection
        </p>
      </div>

   <div className="flex items-center justify-end mb-6">
      <div className="flex items-center  border rounded-md">
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

      {/* Products Grid */}
      <div
        className={`grid gap-6 ${
          viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            : "grid-cols-1"
        }`}
      >
        {products.map((product) => (
          <ProductCard 
          key={product._id} 
          product={product} 
          viewMode={viewMode}
           />
        ))}
      </div>
    </div>
  );
}
