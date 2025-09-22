"use client";

import Image from "next/image";
import Link from "next/link";
import { Category } from "@/src/interfaces";
import { Button } from "@/src/components/ui/button";
import { ExternalLink } from "lucide-react";

interface CategoryCardProps {
  category: Category;
  viewMode?: "grid" | "list";
}

export function CategoryCard({ category, viewMode = "grid" }: CategoryCardProps) {
  if (viewMode === "list") {
    return (
      <div className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
        <div className="relative w-32 h-32 flex-shrink-0">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover rounded-md"
              sizes="128px"
            />
          ) : (
            <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
              <span className="text-2xl font-bold text-muted-foreground">
                {category.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-2">
              <Link
                href={`/categories/${category._id}`}
                className="hover:text-primary transition-colors"
              >
                {category.name}
              </Link>
            </h3>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/categories/${category._id}`}>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-4 mb-3">
            <span className="text-sm text-muted-foreground">
              Slug: {category.slug}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">
                Category ID: {category._id}
              </span>
            </div>

            <Button asChild>
              <Link href={`/categories/${category._id}`}>
                View Category
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col justify-between bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="">
        {/* Category Image */}
        <div className="relative aspect-square overflow-hidden">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors">
              <span className="text-4xl font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                {category.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* View Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
            asChild
          >
            <Link href={`/categories/${category._id}`}>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Category Info */}
        <div className="p-4">
          {/* Category Name */}
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">
            <Link href={`/categories/${category._id}`}>{category.name}</Link>
          </h3>

          {/* Slug */}
          <p className="text-xs text-muted-foreground mb-2">
            {category.slug}
          </p>

          {/* Category ID */}
          <p className="text-xs text-muted-foreground mb-3">
            ID: {category._id}
          </p>
        </div>
      </div>

      {/* View Category Button */}
      <div className="p-4">
        <Button className="w-full" asChild>
          <Link href={`/categories/${category._id}`}>
            View Category
          </Link>
        </Button>
      </div>
    </div>
  );
}
