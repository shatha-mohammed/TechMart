"use client";

import { useState, useEffect } from "react";
import { Order } from "@/src/interfaces";
import { LoadingSpinner } from "@/src/components";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import { OrdersResponse } from "@/src/types/responses";
import { apiServices } from "@/src/services/api";
import { formatPrice } from "@/src/helpers/currency";
import { Calendar, Package, MapPin, CreditCard, CheckCircle, Clock, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AllOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchOrders() {
  setLoading(true);
  try {
    const res: unknown = await apiServices.getAllOrders();

    let ordersList: Order[] = [];

    if (Array.isArray(res)) {
      ordersList = res as Order[];
    } else if (Array.isArray((res as OrdersResponse)?.data)) {
      ordersList = (res as OrdersResponse).data;
    }

    setOrders(ordersList);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to fetch orders");
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusIcon = (isPaid: boolean, isDelivered: boolean) => {
    if (isDelivered) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (isPaid) return <Clock className="h-4 w-4 text-yellow-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusText = (isPaid: boolean, isDelivered: boolean) => {
    if (isDelivered) return "Delivered";
    if (isPaid) return "Processing";
    return "Pending Payment";
  };

  const getStatusVariant = (isPaid: boolean, isDelivered: boolean) => {
    if (isDelivered) return "default";
    if (isPaid) return "secondary";
    return "destructive";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && orders.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchOrders}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">My Orders</h1>
        <p className="text-muted-foreground">
          Track and manage your orders
        </p>
      </div>

      {/* Orders List */}
      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order._id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-lg">Order #{order._id.slice(-8)}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.isPaid, order.isDelivered)}
                    <Badge variant={getStatusVariant(order.isPaid, order.isDelivered)}>
                      {getStatusText(order.isPaid, order.isDelivered)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  <h4 className="font-medium">Order Items</h4>
                  {order.cart?.products && order.cart.products.length > 0 ? (
                    order.cart.products.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden">
                        <Image
                          src={item.product.imageCover}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium line-clamp-1">{item.product.title}</h5>
                        <p className="text-sm text-muted-foreground">Qty: {item.count}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(item.price)}</p>
                        <p className="text-sm text-muted-foreground">each</p>
                      </div>
                    </div>
                  ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No items found in this order</p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Order Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Shipping Address */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-medium">Shipping Address</h4>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>{order.shippingAddress?.details || 'No details provided'}</p>
                      <p>{order.shippingAddress?.city || 'No city provided'}</p>
                      <p>{order.shippingAddress?.phone || 'No phone provided'}</p>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-medium">Payment</h4>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>{order.paymentMethod || 'No payment method specified'}</p>
                      <p className={order.isPaid ? "text-green-600" : "text-red-600"}>
                        {order.isPaid ? "Paid" : "Pending"}
                      </p>
                      {order.paidAt && (
                        <p>Paid on {formatDate(order.paidAt)}</p>
                      )}
                    </div>
                  </div>

                  {/* Order Total */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Order Total</h4>
                    <div className="text-2xl font-bold text-primary">
                      {formatPrice(order.cart?.totalPrice || 0)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.cart?.products?.length || 0} item{(order.cart?.products?.length || 0) !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" asChild>
                    <Link href={`/orders/${order._id}`}>
                      View Details
                    </Link>
                  </Button>
                  {!order.isPaid && (
                    <Button>
                      Pay Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No orders found</h3>
          <p className="text-muted-foreground mb-4">
            {"You’re not signed in yet"}
          </p>
          <Button asChild>
            <Link href="/products">
              Start Shopping
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}