import { apiServices } from "@/src/services/api";
import React from "react";
import InnerCart from "./InnerCart";

export default async function Cart() {
  async function fetchCart() {
    const response = await apiServices.getUserToCart();
    return response;
  }

  const response = await fetchCart();


  return (
  <div className="container mx-auto px-4 py-8">
   <InnerCart cartData={response}/>
  </div>
);

}