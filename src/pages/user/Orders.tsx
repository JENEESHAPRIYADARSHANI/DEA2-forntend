import { UserLayout } from "@/components/layout/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, CheckCircle, Truck } from "lucide-react";
import { useEffect, useState } from "react";

interface Order {
  id: string;
  items: { id: string; name: string; price: number; quantity: number; image: string }[];
  total: number;
  status: string;
  date: string;
}

const statusIcons: Record<string, typeof Package> = {
  Processing: Clock,
  Shipped: Truck,
  Delivered: CheckCircle,
};

const statusColors: Record<string, string> = {
  Processing: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  Shipped: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Delivered: "bg-green-500/10 text-green-600 border-green-500/20",
};

const UserOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("starbags_orders");
    if (stored) {
      setOrders(JSON.parse(stored).reverse());
    }
  }, []);

  return (
    <UserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-foreground mb-2">No orders yet</h3>
              <p className="text-sm text-muted-foreground">
                Your order history will appear here after your first purchase.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const StatusIcon = statusIcons[order.status] || Package;
              return (
                <Card key={order.id} className="border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <CardTitle className="text-lg">{order.id}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={statusColors[order.status] || ""}
                      >
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Qty: {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-border flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="font-bold text-primary">${order.total.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default UserOrders;
