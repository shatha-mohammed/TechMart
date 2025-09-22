"use client";

import { useState, useEffect } from "react";
import { Brand } from "@/src/interfaces";
import { BrandCard } from "@/src/components/brands/BrandCard";
import { LoadingSpinner } from "@/src/components";
import { Button } from "@/src/components/ui/button";
import { Grid, List } from "lucide-react";
import { BrandsResponse } from "@/src/types/responses";
import { apiServices } from "@/src/services/api";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  async function fetchBrands() {
    setLoading(true);
    try {
      const data: BrandsResponse = await apiServices.getAllBrands();
      console.log('Brands API Response:', data);
      if (data && data.data) {
        setBrands(data.data);
      } else {
        console.error('Invalid brands data structure:', data);
        setError('Invalid data structure received');
      }
    } catch (err) {
      console.error('Error fetching brands:', err);
      setError(err instanceof Error ? err.message : "Failed to fetch brands");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBrands();
  }, []);

  if (loading && brands.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchBrands}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Brands</h1>
        <p className="text-muted-foreground">
          Discover amazing brands from our collection
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

      {/* Brands Grid */}
      <div
        className={`grid gap-6 ${
          viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            : "grid-cols-1"
        }`}
      >
        {brands.map((brand) => (
          <BrandCard 
            key={brand._id} 
            brand={brand} 
            viewMode={viewMode}
          />
        ))}
      </div>

      {brands.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No brands found</p>
        </div>
      )}
    </div>
  );
}
