"use client";

import Image from "next/image";
import Link from "next/link";
import { Brand } from "@/src/interfaces";
import { Button } from "@/src/components/ui/button";
import { ExternalLink } from "lucide-react";

interface BrandCardProps {
  brand: Brand;
  viewMode?: "grid" | "list";
}

export function BrandCard({ brand, viewMode = "grid" }: BrandCardProps) {
  if (viewMode === "list") {
    return (
      <div className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
        <div className="relative w-32 h-32 flex-shrink-0">
          <Image
            src={brand.image}
            alt={brand.name}
            fill
            className="object-cover rounded-md"
            sizes="128px"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-2">
              <Link
                href={`/brands/${brand._id}`}
                className="hover:text-primary transition-colors"
              >
                {brand.name}
              </Link>
            </h3>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/brands/${brand._id}`}>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-4 mb-3">
            <span className="text-sm text-muted-foreground">
              Slug: {brand.slug}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">
                Brand ID: {brand._id}
              </span>
            </div>

            <Button asChild>
              <Link href={`/brands/${brand._id}`}>
                View Brand
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
        {/* Brand Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={brand.image}
            alt={brand.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />

          {/* View Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
            asChild
          >
            <Link href={`/brands/${brand._id}`}>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Brand Info */}
        <div className="p-4">
          {/* Brand Name */}
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">
            <Link href={`/brands/${brand._id}`}>{brand.name}</Link>
          </h3>

          {/* Slug */}
          <p className="text-xs text-muted-foreground mb-2">
            {brand.slug}
          </p>

          {/* Brand ID */}
          <p className="text-xs text-muted-foreground mb-3">
            ID: {brand._id}
          </p>
        </div>
      </div>

      {/* View Brand Button */}
      <div className="p-4">
        <Button className="w-full" asChild>
          <Link href={`/brands/${brand._id}`}>
            View Brand
          </Link>
        </Button>
      </div>
    </div>
  );
}
