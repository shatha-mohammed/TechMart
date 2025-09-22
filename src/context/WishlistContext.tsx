"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { WishlistItem } from '@/src/interfaces';
import { apiServices } from '@/src/services/api';
import toast from 'react-hot-toast';

interface WishlistContextType {
  wishlist: WishlistItem[];
  wishlistCount: number;
  isLoading: boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  fetchWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const wishlistCount = wishlist.length;

  // helper: extract productId from various raw shapes
  function extractProductId(raw: any): string | null {
    if (!raw) return null;

    // shape: { product: { _id / id } }
    if (raw.product && (raw.product._id || raw.product.id)) {
      return String(raw.product._id ?? raw.product.id);
    }

    // shape: { productId: "..." }
    if (raw.productId) return String(raw.productId);

    // shape: raw string (productId)
    if (typeof raw === "string") return raw;

    // shape: array like ["userId", "productId"] or [productId]
    if (Array.isArray(raw) && (raw[1] || raw[0])) return String(raw[1] ?? raw[0]);

    // shape: maybe the raw itself is a product object { _id / id }
    if (raw._id || raw.id) return String(raw._id ?? raw.id);

    return null;
  }

  // fetch product details for ids in parallel, return map id -> product
  async function fetchProductsByIds(ids: string[]) {
    const uniqueIds = Array.from(new Set(ids)).filter(Boolean);
    const productsById: Record<string, any> = {};

    await Promise.all(
      uniqueIds.map(async (id) => {
        try {
          const res = await apiServices.getProductDetails(String(id));
          const product = res?.data ?? res ?? null;
          productsById[id] = product;
        } catch (e) {
          console.warn("Wishlist: failed to fetch product", id, e);
          productsById[id] = null;
        }
      })
    );

    return productsById;
  }

  const fetchWishlist = async () => {
    setIsLoading(true);
    try {
      const data = await apiServices.getWishlist();
      console.log('Wishlist API Response:', data);

      const rawItems: any[] = data?.data ?? data ?? [];

      if (!Array.isArray(rawItems)) {
        console.error('Invalid wishlist data structure:', rawItems);
        setWishlist([]);
        return;
      }

      // extract product ids
      const productIds = rawItems
        .map((r) => extractProductId(r))
        .filter(Boolean) as string[];

      const productsById = await fetchProductsByIds(productIds);

      // normalize items into shape that contains product
      const normalized: WishlistItem[] = rawItems.map((raw, idx) => {
        const pid = extractProductId(raw) ?? `${idx}`;
        const product = productsById[pid] ?? null;

        // try to create an _id for the wishlist item if not provided
        const wlId = raw?._id ?? raw?.id ?? `${pid}-wl-${idx}`;

        // Build object following your WishlistItem interface expectation:
        // keep original raw item in case backend returns different fields
        const item: any = {
          _id: wlId,
          productId: pid,
          product,
          raw,
        };

        return item as WishlistItem;
      });

      // optionally filter items missing product to avoid render errors
      const validItems = normalized.filter((it) => it && (it as any).product && ((it as any).product._id || (it as any).product.id));
      console.log('Normalized wishlist items:', normalized);
      console.log('Valid wishlist items:', validItems);

      setWishlist(validItems);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      setWishlist([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addToWishlist = async (productId: string) => {
    try {
      const data = await apiServices.addToWishlist(productId);
      console.log('Add to wishlist response:', data);
      // refresh canonical wishlist from server (handles cases where backend returns only ids)
      await fetchWishlist();
      toast.success('Added to wishlist');
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      toast.error('Failed to add to wishlist');
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      // attempt apiServices remove function if present
      if (typeof (apiServices as any).removeFromWishlist === 'function') {
        await (apiServices as any).removeFromWishlist(productId);
      } else {
        // fallback: call DELETE endpoint
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/wishlist/${productId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...(typeof (apiServices as any).getHeaders === 'function'
              ? (apiServices as any).getHeaders()
              : {}),
          },
        });
      }

      // refresh
      await fetchWishlist();
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => {
      const pid = (item as any).productId ?? ((item as any).product && ((item as any).product._id ?? (item as any).product.id));
      return pid === productId;
    });
  };

  useEffect(() => {
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        isLoading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
