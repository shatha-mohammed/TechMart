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

// Very loose product shape we expect from getProductDetails
type MinimalProduct = {
  _id?: string;
  id?: string;
  title?: string;
  imageCover?: string;
  price?: number;
};

// Raw wishlist item can be many shapes; type as union of likely fields
type RawWishlistItem = {
  _id?: string;
  id?: string;
  product?: { _id?: string; id?: string } & MinimalProduct;
  productId?: string;
} | string | [unknown, unknown] | Record<string, unknown>;

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const wishlistCount = wishlist.length;

  function extractProductId(raw: RawWishlistItem): string | null {
    if (!raw) return null;

    if (typeof raw === 'string') return raw;

    if (Array.isArray(raw)) {
      const candidate = (raw[1] ?? raw[0]) as unknown;
      return typeof candidate === 'string' ? candidate : null;
    }

    if ('product' in raw && raw.product && (raw.product._id || raw.product.id)) {
      return String(raw.product._id ?? raw.product.id);
    }

    if ('productId' in raw && raw.productId) return String(raw.productId);

    if ('_id' in raw && raw._id) return String(raw._id);
    if ('id' in raw && raw.id) return String(raw.id);

    return null;
  }

  async function fetchProductsByIds(ids: string[]) {
    const uniqueIds = Array.from(new Set(ids)).filter(Boolean);
    const productsById: Record<string, MinimalProduct | null> = {};

    await Promise.all(
      uniqueIds.map(async (id) => {
        try {
          const res = await apiServices.getProductDetails(String(id));
          const product = (res?.data ?? res ?? null) as MinimalProduct | null;
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
      const rawItems = (data?.data ?? data ?? []) as RawWishlistItem[];

      if (!Array.isArray(rawItems)) {
        console.error('Invalid wishlist data structure:', rawItems);
        setWishlist([]);
        return;
      }

      const productIds = rawItems
        .map((r) => extractProductId(r))
        .filter((x): x is string => typeof x === 'string');

      const productsById = await fetchProductsByIds(productIds);

      const normalized: WishlistItem[] = rawItems.map((raw, idx) => {
        const pid = extractProductId(raw) ?? `${idx}`;
        const product = productsById[pid] ?? null;
        const wlId = (typeof raw === 'object' && raw && ('_id' in raw) && raw._id ? String(raw._id) : undefined) ||
                     (typeof raw === 'object' && raw && ('id' in raw) && raw.id ? String(raw.id) : undefined) || `${pid}-wl-${idx}`;

        return {
          _id: wlId,
          user: '',
          product: {
            _id: product?._id ?? product?.id ?? pid,
            title: product?.title ?? '',
            imageCover: product?.imageCover ?? '',
            price: product?.price ?? 0,
            brand: { _id: '', name: 'Unknown' },
            category: { _id: '', name: 'Unknown' }
          },
          createdAt: new Date().toISOString()
        } as WishlistItem;
      }).filter((it) => Boolean(it.product && (it.product._id)));

      setWishlist(normalized);
    } catch (error: unknown) {
      console.error('Failed to fetch wishlist:', error);
      setWishlist([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addToWishlist = async (productId: string) => {
    try {
      await apiServices.addToWishlist(productId);
      await fetchWishlist();
      toast.success('Added to wishlist');
    } catch (error: unknown) {
      console.error('Failed to add to wishlist:', error);
      toast.error('Failed to add to wishlist');
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      if (typeof (apiServices as unknown as { removeFromWishlist?: (id: string) => Promise<unknown> }).removeFromWishlist === 'function') {
        await (apiServices as unknown as { removeFromWishlist: (id: string) => Promise<unknown> }).removeFromWishlist(productId);
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/wishlist/${productId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      await fetchWishlist();
      toast.success('Removed from wishlist');
    } catch (error: unknown) {
      console.error('Failed to remove from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => {
      const pid = (item as unknown as { productId?: string; product?: { _id?: string; id?: string } }).productId
        ?? (item.product && (item.product._id ?? (item.product as unknown as { id?: string }).id));
      return pid === productId;
    });
  };

  useEffect(() => {
    fetchWishlist();
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
