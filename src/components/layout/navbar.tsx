"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, User, Menu, X, Loader2, LogOut, Heart } from "lucide-react";
import { Button } from "@/src/components";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/src/components";
import { cn } from "@/src/lib/utils";
import React, { useState } from "react";
import { cartContext } from "@/src/context/CartContext";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { signOut, useSession } from "next-auth/react";
import { RootState } from "@/src/redux/store"

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, isLoading} = useContext(cartContext);
  const { count } = useSelector((state: RootState) => state.counter);
  const {data, status} = useSession();

  

  
  const navItems = [
    { href: "/products", label: "Products" },
    { href: "/brands", label: "Brands" },
    { href: "/categories", label: "Categories" },
    { href: "/allorders", label: "Orders" },
  ];


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                T
              </span>
            </div>
            <span className="font-bold text-xl">TechMart</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navItems.map((item) => {
                const isActive =
                  item.href == "/"
                    ? pathname == "/"
                    : pathname.startsWith(item.href);

                return (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink
                      href={item.href}
                      className={cn(
                        "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md font-semibold"
                          : "bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      )}
                    >
                      {item.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {status == "loading" ? (
              "Loading..."
            ) : status == "authenticated" ? (
              <>
                {/* User Account */}
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Button>

                {/* Shopping Cart */}
                <Link href={"/cart"}>
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                      {isLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        cartCount
                      )}
                    </span>
                    <span className="sr-only">Shopping cart</span>
                  </Button>
                </Link>

                {/* Wishlist */}
                <Link href={"/wishlist"}>
                  <Button variant="ghost" size="icon">
                    <Heart className="h-5 w-5" />
                    <span className="sr-only">Wishlist</span>
                  </Button>
                </Link>
                <div className="flex gap-2 ms-3 items-center">
                  <p>Hi Shosho</p>
                  <Button onClick={() => signOut()} variant="ghost" size="icon">
                    <LogOut className="h-5 w-5" />
                    <span className="sr-only">Logout</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href={"/auth/login"}>login</Link>
                <span className="text-muted-foreground">/</span>
                <Link href={"/auth/register"} className="text-primary hover:underline">Sign up</Link>
              </div>
            )}

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href === "/products" &&
                    pathname.startsWith("/products"));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Mobile auth links when logged out */}
              {status !== "authenticated" && (
                <div className="flex items-center gap-3 px-4 pt-2">
                  <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>login</Link>
                  <span className="text-muted-foreground">/</span>
                  <Link href="/auth/register" className="text-primary" onClick={() => setIsMobileMenuOpen(false)}>Sign up</Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}