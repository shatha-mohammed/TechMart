"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function hasProduct(obj: Record<string, unknown>): obj is { product: Record<string, unknown> } {
  return 'product' in obj && isRecord((obj as Record<string, unknown>).product as unknown);
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  const wishlistCount = wishlist.length;

  function extractProductId(raw: RawWishlistItem): string | null {
    if (!raw) return null;

    if (typeof raw === 'string') return raw;

    if (Array.isArray(raw)) {
      const candidate = (raw[1] ?? raw[0]) as unknown;
      return typeof candidate === 'string' ? candidate : null;
    }

    if (isRecord(raw)) {
      if (hasProduct(raw)) {
        const p = raw.product as { _id?: unknown; id?: unknown };
        const pid = (typeof p._id === 'string' ? p._id : undefined) || (typeof p.id === 'string' ? p.id : undefined);
        if (pid) return pid;
      }

      if ('productId' in raw && typeof (raw as Record<string, unknown>).productId === 'string') {
        return (raw as { productId: string }).productId;
      }

      if ('_id' in raw && typeof (raw as Record<string, unknown>)._id === 'string') {
        return (raw as { _id: string })._id;
      }
      if ('id' in raw && typeof (raw as Record<string, unknown>).id === 'string') {
        return (raw as { id: string }).id;
      }
    }

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
        if (isMountedRef.current) setWishlist([]);
        return;
      }

      const productIds = rawItems
        .map((r) => extractProductId(r))
        .filter((x): x is string => typeof x === 'string');

      const productsById = await fetchProductsByIds(productIds);

      const normalized: WishlistItem[] = rawItems.map((raw, idx) => {
        const pid = extractProductId(raw) ?? `${idx}`;
        const product = productsById[pid] ?? null;
        const wlId = (isRecord(raw) && '_id' in raw && typeof (raw as Record<string, unknown>)._id === 'string' ? String((raw as { _id: string })._id) : undefined) ||
                     (isRecord(raw) && 'id' in raw && typeof (raw as Record<string, unknown>).id === 'string' ? String((raw as { id: string }).id) : undefined) || `${pid}-wl-${idx}`;

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

      if (isMountedRef.current) setWishlist(normalized);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to fetch wishlist';
      console.error('Failed to fetch wishlist:', error);
      if (isMountedRef.current) setWishlist([]);
      toast.error(msg);
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  };

  const addToWishlist = async (productId: string) => {
    try {
      await apiServices.addToWishlist(productId);
      await fetchWishlist();
      toast.success('Added to wishlist');
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to add to wishlist';
      console.error('Failed to add to wishlist:', error);
      toast.error(msg);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      if (typeof (apiServices as unknown as { removeFromWishlist?: (id: string) => Promise<unknown> }).removeFromWishlist === 'function') {
        await (apiServices as unknown as { removeFromWishlist: (id: string) => Promise<unknown> }).removeFromWishlist(productId);
      } else {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        if (!baseUrl) {
          throw new Error('Base URL is not configured');
        }
        await fetch(`${baseUrl}api/v1/wishlist/${productId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      await fetchWishlist();
      toast.success('Removed from wishlist');
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to remove from wishlist';
      console.error('Failed to remove from wishlist:', error);
      toast.error(msg);
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
