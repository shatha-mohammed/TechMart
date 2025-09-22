"use client"

import CartContextProvider from "@/src/context/CartContext";
import { WishlistProvider } from "@/src/context/WishlistContext";
import { store } from "@/src/redux/store";
import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";
import { Provider } from "react-redux";

export default function ProvidersContainer({
  children,
}: {
  children: ReactNode;
}) {
  return (
   <SessionProvider>
     <Provider store={store}>
      <CartContextProvider>
        <WishlistProvider>
          {children}
        </WishlistProvider>
      </CartContextProvider>
    </Provider>
   </SessionProvider>
  );
}
