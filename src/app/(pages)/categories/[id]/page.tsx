"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Product, Category } from "@/src/interfaces";
import { ProductCard } from "@/src/components/products/ProductCard";
import { LoadingSpinner } from "@/src/components";
import { Button } from "@/src/components/ui/button";
import { Grid, List, ArrowLeft } from "lucide-react";
import { ProductsResponse, SingleCategoryResponse } from "@/src/types/responses";
import { apiServices } from "@/src/services/api";
import Link from "next/link";
import Image from "next/image";

export default function CategoryProductsPage() {
  const { id } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  async function fetchCategoryAndProducts() {
    setLoading(true);
    try {
      const [categoryData, productsData] = await Promise.all([
        apiServices.getCategoryDetails(String(id)),
        apiServices.getProductsByCategory(String(id))
      ]);
      
      setCategory(categoryData.data);
      setProducts(productsData.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch category data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      fetchCategoryAndProducts();
    }
  }, [id]);

  if (loading && products.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchCategoryAndProducts}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Category not found</p>
          <Link href="/categories">
            <Button>Back to Categories</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/categories">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Categories
          </Button>
        </Link>
      </div>

      {/* Category Header */}
      <div className="mb-8">
        <div className="flex items-center gap-6 mb-6">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
            {category.image ? (
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-2xl font-bold text-muted-foreground">
                  {category.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
            <p className="text-muted-foreground">
              Browse products in {category.name} category
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {products.length} product{products.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Products</h2>
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

      {/* Products Grid */}
      {products.length > 0 ? (
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
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No products found in {category.name} category
          </p>
          <Link href="/products" className="mt-4 inline-block">
            <Button>Browse All Products</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
