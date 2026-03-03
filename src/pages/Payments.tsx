import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, CreditCard, Wallet } from "lucide-react";
import { usePayments } from "@/contexts/PaymentContext";
import { PaymentMethod, SavedPaymentMethod } from "@/types/payment";

const methodLabels: Record<PaymentMethod, string> = {
  card: "Card",
  cash: "Cash",
  online_transfer: "Online Transfer",
};

export default function Payments() {
  const { savedMethods, addSavedMethod, updateSavedMethod, deleteSavedMethod } = usePayments();

  const [methodDialogOpen, setMethodDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<SavedPaymentMethod | null>(null);
  const [methodForm, setMethodForm] = useState({
    methodType: "card" as PaymentMethod,
    cardHolderName: "", maskedCardNumber: "", expiryDate: "",
  });

  const openMethodDialog = (method?: SavedPaymentMethod) => {
    if (method) {
      setEditingMethod(method);
      setMethodForm({
        methodType: method.methodType, cardHolderName: method.cardHolderName,
        maskedCardNumber: method.maskedCardNumber, expiryDate: method.expiryDate,
      });
    } else {
      setEditingMethod(null);
      setMethodForm({ methodType: "card", cardHolderName: "", maskedCardNumber: "", expiryDate: "" });
    }
    setMethodDialogOpen(true);
  };

  const handleMethodSubmit = () => {
    if (editingMethod) {
      updateSavedMethod(editingMethod.id, methodForm);
    } else {
      addSavedMethod(methodForm);
    }
    setMethodDialogOpen(false);
  };

  return (
    <DashboardLayout title="Payments" subtitle="Manage saved payment methods for customers">
      <Card className="shadow-lg border-border/50">
        <CardHeader className="bg-muted/30 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Saved Payment Methods
              </CardTitle>
              <CardDescription className="mt-1">Manage saved payment methods for customers</CardDescription>
            </div>
            <Button onClick={() => openMethodDialog()} className="btn-gradient">
              <Plus className="h-4 w-4 mr-2" />
              Add Method
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {savedMethods.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Wallet className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="font-medium">No saved payment methods</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {savedMethods.map((method) => (
                <Card key={method.id} className="border-border/50 hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant="outline" className="capitalize">{methodLabels[method.methodType]}</Badge>
                    </div>
                    <p className="font-mono text-lg font-semibold tracking-wider mb-1">{method.maskedCardNumber}</p>
                    <p className="text-sm font-medium">{method.cardHolderName}</p>
                    <p className="text-xs text-muted-foreground mt-1">Expires {method.expiryDate}</p>
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => openMethodDialog(method)}>
                        <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => deleteSavedMethod(method.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Saved Method Dialog */}
      <Dialog open={methodDialogOpen} onOpenChange={setMethodDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingMethod ? "Edit Payment Method" : "Add Payment Method"}</DialogTitle>
            <DialogDescription>Enter payment method details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label>Method Type</Label>
              <Select value={methodForm.methodType} onValueChange={(v) => setMethodForm({ ...methodForm, methodType: v as PaymentMethod })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="online_transfer">Online Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Card Holder Name</Label>
              <Input value={methodForm.cardHolderName} onChange={(e) => setMethodForm({ ...methodForm, cardHolderName: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Masked Card Number</Label>
                <Input value={methodForm.maskedCardNumber} onChange={(e) => setMethodForm({ ...methodForm, maskedCardNumber: e.target.value })} placeholder="**** **** **** 1234" />
              </div>
              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Input value={methodForm.expiryDate} onChange={(e) => setMethodForm({ ...methodForm, expiryDate: e.target.value })} placeholder="MM/YY" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMethodDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleMethodSubmit} className="btn-gradient">{editingMethod ? "Update" : "Add"} Method</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
