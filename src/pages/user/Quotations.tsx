import { UserLayout } from "@/components/layout/UserLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useQuotations } from "@/contexts/QuotationContext";
import { QuotationStatus } from "@/types/quotation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  FileText,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRightLeft,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig: Record<QuotationStatus, { label: string; icon: typeof Clock; className: string }> = {
  draft: {
    label: "Draft",
    icon: Clock,
    className: "bg-warning/10 text-warning border-warning/20",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle,
    className: "bg-success/10 text-success border-success/20",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  converted: {
    label: "Converted to Order",
    icon: ArrowRightLeft,
    className: "bg-primary/10 text-primary border-primary/20",
  },
};

const UserQuotations = () => {
  const { user } = useAuth();
  const { getQuotationsByUser } = useQuotations();
  const quotations = user ? getQuotationsByUser(user.id) : [];

  const sorted = [...quotations].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <UserLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              My Quotations
            </h1>
            <p className="text-muted-foreground">Track the status of your quotation requests</p>
          </div>
          <Link to="/user/request-quotation">
            <Button className="btn-gradient gap-2">
              <Plus className="h-4 w-4" />
              New Quotation
            </Button>
          </Link>
        </div>

        {sorted.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-foreground mb-2">No quotations yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Request a quotation for corporate bulk orders
              </p>
              <Link to="/user/request-quotation">
                <Button className="btn-gradient gap-2">
                  <Plus className="h-4 w-4" />
                  Request Quotation
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sorted.map((quotation) => {
              const config = statusConfig[quotation.status];
              const StatusIcon = config.icon;

              return (
                <Card key={quotation.id} className="border-border/50 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{quotation.id}</CardTitle>
                          <p className="text-sm text-muted-foreground">{quotation.companyName}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={cn("font-medium", config.className)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {config.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {quotation.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.productName} × {item.quantity}
                          </span>
                          <span className="font-medium">${item.total.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-border flex flex-wrap justify-between items-center gap-2">
                      <div className="text-sm text-muted-foreground">
                        Requested on{" "}
                        {new Date(quotation.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-muted-foreground mr-2">Total:</span>
                        <span className="text-lg font-bold text-primary">
                          ${quotation.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    {quotation.status === "rejected" && quotation.rejectionReason && (
                      <div className="mt-3 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                        <p className="text-sm text-destructive">
                          <strong>Reason:</strong> {quotation.rejectionReason}
                        </p>
                      </div>
                    )}
                    {quotation.status === "converted" && quotation.convertedOrderId && (
                      <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <p className="text-sm text-primary">
                          <strong>Order Created:</strong> {quotation.convertedOrderId}
                        </p>
                      </div>
                    )}
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

export default UserQuotations;
