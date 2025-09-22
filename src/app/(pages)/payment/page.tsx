"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import  CartProduct from "@/src/components/products/CartProduct";
import { LoadingSpinner } from "@/src/components";
import { useContext, useState as useStateCart } from "react";
import { cartContext } from "@/src/context/CartContext";
import { formatPrice } from "@/src/helpers/currency";
import { CreditCard, MapPin, Package, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { apiServices } from "@/src/services/api";
import { useRouter } from "next/navigation";
import { GetUserCartResponse } from "@/src/interfaces";

export default function PaymentPage() {
  const { isLoading } = useContext(cartContext);
  const [cartData, setCartData] = useStateCart<GetUserCartResponse | null>(null);
  const [cartLoading, setCartLoading] = useStateCart(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    details: "",
    phone: "",
    city: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const router = useRouter();

  // Fetch cart data
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setCartLoading(true);
        const data = await apiServices.getUserToCart();
        setCartData(data);
      } catch (error) {
        console.error('Failed to fetch cart data:', error);
        toast.error('Failed to load cart data');
      } finally {
        setCartLoading(false);
      }
    };

    fetchCartData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  // simple phone validation: allows + and digits, length 7-15
  function isValidPhone(phone: string) {
    return /^\+?\d{7,15}$/.test(phone);
  }

  const handleCheckout = async () => {
    if (!shippingAddress.details || !shippingAddress.phone || !shippingAddress.city) {
      toast.error("Please fill in all shipping details");
      return;
    }

    if (!isValidPhone(shippingAddress.phone)) {
      toast.error("Please enter a valid phone number (digits only, optional leading +)");
      return;
    }

    setIsProcessing(true);
    try {
      const orderData = {
        shippingAddress,
        paymentMethod,
      };

      // create order
      const order = await apiServices.createOrder(orderData);
      console.debug("createOrder response:", order);

      // Extract cart id from order response
      const cartId = order?.data?._id ?? null;

      // if there's a cart id, call checkout; otherwise attempt to read other shapes
      if (!cartId) {
        // maybe the API returns order.data with a full order that contains cart id in another field
        // fallback: try order?.data?._id as cart id (depends on backend)
        console.warn("Could not determine cart id from createOrder response:", order);
      }

      // call checkout (if backend expects cart id; otherwise adjust according to your API)
      const checkoutTargetId = cartId ?? (order?.data?._id ?? undefined);
      const paymentResult = checkoutTargetId
        ? await apiServices.checkout(String(checkoutTargetId))
        : await apiServices.checkout(""); // if your API accepts empty or different arg, adjust accordingly

      console.debug("checkout response:", paymentResult);

      // If backend returns a redirect URL for payment gateway
      if (paymentResult?.url) {
        // external redirect to payment gateway
        window.location.href = paymentResult.url;
        return;
      }

      // If no external URL, assume success and navigate to orders
      toast.success("Order placed successfully!");
      router.push("/allorders");
    } catch (error: any) {
      console.error("Payment error:", error);
      // show backend error message if present
      const msg = error?.message ?? "Failed to process payment";
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartLoading || isLoading) {
    return <LoadingSpinner />;
  }

  if (!cartData || cartData.numOfCartItems === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">
            Add some items to your cart before proceeding to checkout.
          </p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/cart">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Checkout</h1>
          </div>
          <p className="text-muted-foreground">Complete your order and payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Order Details */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
                <CardDescription>Enter your shipping information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="details">Address Details</Label>
                  <Input
                    id="details"
                    name="details"
                    placeholder="Street address, apartment, suite, etc."
                    value={shippingAddress.details}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="+201012345678"
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="Cairo"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
                <CardDescription>Choose your preferred payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="card"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="card" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Credit/Debit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="paypal"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="paypal">PayPal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="cash"
                      name="payment"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="cash">Cash on Delivery</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  {cartData.numOfCartItems} item{cartData.numOfCartItems !== 1 ? "s" : ""} in your order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartData.data.products.map((item) => (
                    <div key={item._id} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden">
                        <img
                          src={item.product.imageCover}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-1">{item.product.title}</h4>
                        <p className="text-xs text-muted-foreground">Qty: {item.count}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{formatPrice(item.price * item.count)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Total */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(cartData.data.totalCartPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(cartData.data.totalCartPrice)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Place Order Button */}
            <Button onClick={handleCheckout} disabled={isProcessing} className="w-full" size="lg">
              {isProcessing && <Loader2 className="animate-spin mr-2" />}
              {isProcessing ? "Processing..." : `Place Order - ${formatPrice(cartData.data.totalCartPrice)}`}
            </Button>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                By placing your order, you agree to our{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
