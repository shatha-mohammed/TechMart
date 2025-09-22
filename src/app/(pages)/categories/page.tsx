"use client";

import { useState, useEffect } from "react";
import { Category } from "@/src/interfaces";
import { CategoryCard } from "@/src/components/categories/CategoryCard";
import { LoadingSpinner } from "@/src/components";
import { Button } from "@/src/components/ui/button";
import { Grid, List } from "lucide-react";
import { CategoriesResponse } from "@/src/types/responses";
import { apiServices } from "@/src/services/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  async function fetchCategories() {
    setLoading(true);
    try {
      const data: CategoriesResponse = await apiServices.getAllCategories();
      console.log('Categories API Response:', data);
      if (data && data.data) {
        setCategories(data.data);
      } else {
        console.error('Invalid categories data structure:', data);
        setError('Invalid data structure received');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading && categories.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchCategories}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Categories</h1>
        <p className="text-muted-foreground">
          Browse products by category
        </p>
      </div>

      <div className="flex items-center justify-end mb-6">
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

      {/* Categories Grid */}
      <div
        className={`grid gap-6 ${
          viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            : "grid-cols-1"
        }`}
      >
        {categories.map((category) => (
          <CategoryCard 
            key={category._id} 
            category={category} 
            viewMode={viewMode}
          />
        ))}
      </div>

      {categories.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No categories found</p>
        </div>
      )}
    </div>
  );
}
