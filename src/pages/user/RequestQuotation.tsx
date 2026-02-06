import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserLayout } from "@/components/layout/UserLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useQuotations } from "@/contexts/QuotationContext";
import { QuotationItem } from "@/types/quotation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, FileText, Send } from "lucide-react";
import { toast } from "sonner";

const AVAILABLE_PRODUCTS = [
  { id: "1", name: "Executive Leather Briefcase", price: 299.99 },
  { id: "2", name: "Urban Travel Backpack", price: 149.99 },
  { id: "3", name: "Classic Tote Bag", price: 189.99 },
  { id: "4", name: "Vintage Messenger Bag", price: 179.99 },
  { id: "5", name: "Weekend Duffle Bag", price: 229.99 },
  { id: "6", name: "Minimalist Laptop Sleeve", price: 79.99 },
];

const RequestQuotation = () => {
  const { user } = useAuth();
  const { createQuotation } = useQuotations();
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  const [items, setItems] = useState<QuotationItem[]>([
    { productId: "", productName: "", quantity: 1, unitPrice: 0, discount: 0, total: 0 },
  ]);

  const handleProductChange = (index: number, productId: string) => {
    const product = AVAILABLE_PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              productId: product.id,
              productName: product.name,
              unitPrice: product.price,
              total: product.price * item.quantity * (1 - item.discount / 100),
            }
          : item
      )
    );
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              quantity,
              total: item.unitPrice * quantity * (1 - item.discount / 100),
            }
          : item
      )
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { productId: "", productName: "", quantity: 1, unitPrice: 0, discount: 0, total: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity * (1 - item.discount / 100),
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyName.trim()) {
      toast.error("Please enter your company name");
      return;
    }

    const validItems = items.filter((item) => item.productId && item.quantity > 0);
    if (validItems.length === 0) {
      toast.error("Please add at least one product");
      return;
    }

    createQuotation({
      companyName,
      contactPerson,
      email,
      phone,
      specialNotes,
      items: validItems,
      userId: user?.id || "",
    });

    toast.success("Quotation request submitted successfully!");
    navigate("/user/quotations");
  };

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Request Quotation
          </h1>
          <p className="text-muted-foreground">
            Fill in your details and select products for a corporate quotation
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Details */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Company Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name *</Label>
                <Input
                  id="company"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Your company name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Person</Label>
                <Input
                  id="contact"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+94 XX XXX XXXX"
                />
              </div>
            </CardContent>
          </Card>

          {/* Product Selection */}
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Products</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-1" />
                Add Product
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="grid gap-3 sm:grid-cols-[1fr_100px_100px_auto] items-end p-4 rounded-lg bg-muted/50 border border-border/50"
                >
                  <div className="space-y-2">
                    <Label>Product *</Label>
                    <Select
                      value={item.productId}
                      onValueChange={(val) => handleProductChange(index, val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_PRODUCTS.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} — ${product.price.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity *</Label>
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit Price</Label>
                    <Input value={`$${item.unitPrice.toFixed(2)}`} disabled />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {/* Totals */}
              <div className="flex flex-col items-end gap-1 pt-4 border-t border-border">
                <div className="flex gap-4 text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex gap-4 text-lg">
                  <span className="font-medium">Estimated Total:</span>
                  <span className="font-bold text-primary">${totalAmount.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Final pricing will be confirmed by our sales team
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Special Notes */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Special Notes (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="Any special requirements, customization, branding, delivery preferences..."
                rows={4}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate("/shop")}>
              Cancel
            </Button>
            <Button type="submit" className="btn-gradient gap-2">
              <Send className="h-4 w-4" />
              Request Quotation
            </Button>
          </div>
        </form>
      </div>
    </UserLayout>
  );
};

export default RequestQuotation;
