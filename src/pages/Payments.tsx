import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Plus, Pencil, Trash2, Eye, Search, CreditCard, History, Wallet,
  DollarSign, CheckCircle2, XCircle, Clock, RotateCcw, ShieldCheck,
} from "lucide-react";
import { usePayments } from "@/contexts/PaymentContext";
import { Payment, PaymentStatus, PaymentMethod, SavedPaymentMethod } from "@/types/payment";

const statusConfig: Record<PaymentStatus, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Pending", color: "bg-warning/10 text-warning border-warning/20", icon: Clock },
  completed: { label: "Completed", color: "bg-success/10 text-success border-success/20", icon: CheckCircle2 },
  failed: { label: "Failed", color: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle },
};

const methodLabels: Record<PaymentMethod, string> = {
  card: "Card",
  cash: "Cash",
  online_transfer: "Online Transfer",
};

export default function Payments() {
  const {
    payments, savedMethods,
    addPayment, updatePayment, deletePayment,
    addSavedMethod, updateSavedMethod, deleteSavedMethod,
  } = usePayments();

  // Payment dialog state
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [viewingPayment, setViewingPayment] = useState<Payment | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    orderId: "", customerName: "", amount: 0, method: "card" as PaymentMethod,
    paymentDate: new Date().toISOString().split("T")[0], status: "pending" as PaymentStatus,
    transactionRef: "",
  });

  // History filters
  const [historySearch, setHistorySearch] = useState("");
  const [historyStatusFilter, setHistoryStatusFilter] = useState<string>("all");
  const [historyDateFrom, setHistoryDateFrom] = useState("");
  const [historyDateTo, setHistoryDateTo] = useState("");

  // Saved method dialog
  const [methodDialogOpen, setMethodDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<SavedPaymentMethod | null>(null);
  const [methodForm, setMethodForm] = useState({
    methodType: "card" as PaymentMethod,
    cardHolderName: "", maskedCardNumber: "", expiryDate: "",
  });

  // Search for payment management tab
  const [paymentSearch, setPaymentSearch] = useState("");

  // Stats
  const totalRevenue = payments.filter((p) => p.status === "completed").reduce((s, p) => s + p.amount, 0);
  const pendingCount = payments.filter((p) => p.status === "pending").length;
  const completedCount = payments.filter((p) => p.status === "completed").length;
  const failedCount = payments.filter((p) => p.status === "failed").length;

  // Filtered payments for management tab
  const filteredPayments = payments.filter((p) =>
    p.id.toLowerCase().includes(paymentSearch.toLowerCase()) ||
    p.orderId.toLowerCase().includes(paymentSearch.toLowerCase()) ||
    p.customerName.toLowerCase().includes(paymentSearch.toLowerCase())
  );

  // Filtered payments for history tab
  const filteredHistory = payments.filter((p) => {
    const matchesSearch =
      p.id.toLowerCase().includes(historySearch.toLowerCase()) ||
      p.orderId.toLowerCase().includes(historySearch.toLowerCase()) ||
      p.customerName.toLowerCase().includes(historySearch.toLowerCase()) ||
      p.transactionRef.toLowerCase().includes(historySearch.toLowerCase());
    const matchesStatus = historyStatusFilter === "all" || p.status === historyStatusFilter;
    const matchesFrom = !historyDateFrom || p.paymentDate >= historyDateFrom;
    const matchesTo = !historyDateTo || p.paymentDate <= historyDateTo;
    return matchesSearch && matchesStatus && matchesFrom && matchesTo;
  });

  // Handlers
  const openPaymentDialog = (payment?: Payment) => {
    if (payment) {
      setEditingPayment(payment);
      setPaymentForm({
        orderId: payment.orderId, customerName: payment.customerName,
        amount: payment.amount, method: payment.method,
        paymentDate: payment.paymentDate, status: payment.status,
        transactionRef: payment.transactionRef,
      });
    } else {
      setEditingPayment(null);
      setPaymentForm({
        orderId: "", customerName: "", amount: 0, method: "card",
        paymentDate: new Date().toISOString().split("T")[0], status: "pending",
        transactionRef: `TXN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      });
    }
    setPaymentDialogOpen(true);
  };

  const handlePaymentSubmit = () => {
    if (editingPayment) {
      updatePayment(editingPayment.id, paymentForm);
    } else {
      addPayment(paymentForm);
    }
    setPaymentDialogOpen(false);
  };

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
    <DashboardLayout title="Payments" subtitle="Manage payments, view history, and handle payment methods">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold text-primary">${totalRevenue.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-success">{completedCount}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-warning">{pendingCount}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed</p>
                <p className="text-3xl font-bold text-destructive">{failedCount}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="management" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[600px] h-12 p-1 bg-muted/50">
          <TabsTrigger value="management" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Payments</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
          <TabsTrigger value="methods" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">Saved Methods</span>
          </TabsTrigger>
        </TabsList>

        {/* ===== TAB 1: Payment Management ===== */}
        <TabsContent value="management" className="space-y-4">
          <Card className="shadow-lg border-border/50">
            <CardHeader className="bg-muted/30 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Payment Management
                  </CardTitle>
                  <CardDescription className="mt-1">Record, view, and manage all payments</CardDescription>
                </div>
                <Button onClick={() => openPaymentDialog()} className="btn-gradient">
                  <Plus className="h-4 w-4 mr-2" />
                  Record Payment
                </Button>
              </div>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Payment ID, Order ID, or Customer..."
                  value={paymentSearch}
                  onChange={(e) => setPaymentSearch(e.target.value)}
                  className="pl-10 max-w-md"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/20 hover:bg-muted/20">
                      <TableHead className="font-semibold">Payment ID</TableHead>
                      <TableHead className="font-semibold">Order ID</TableHead>
                      <TableHead className="font-semibold">Customer</TableHead>
                      <TableHead className="font-semibold">Amount</TableHead>
                      <TableHead className="font-semibold">Method</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                          <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-20" />
                          <p className="font-medium">No payments found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPayments.map((payment) => {
                        const sc = statusConfig[payment.status];
                        const StatusIcon = sc.icon;
                        return (
                          <TableRow key={payment.id} className="hover:bg-muted/30 transition-colors">
                            <TableCell className="font-mono text-sm font-medium">{payment.id}</TableCell>
                            <TableCell className="font-mono text-sm">{payment.orderId}</TableCell>
                            <TableCell className="font-medium">{payment.customerName}</TableCell>
                            <TableCell className="font-semibold">${payment.amount.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">{methodLabels[payment.method]}</Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{payment.paymentDate}</TableCell>
                            <TableCell>
                              <Badge className={`${sc.color} border gap-1`}>
                                <StatusIcon className="h-3 w-3" />
                                {sc.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewingPayment(payment)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openPaymentDialog(payment)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                {payment.status === "completed" ? (
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-warning hover:text-warning" onClick={() => updatePayment(payment.id, { status: "pending" })}>
                                    <RotateCcw className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deletePayment(payment.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== TAB 2: Payment History & Verification ===== */}
        <TabsContent value="history" className="space-y-4">
          <Card className="shadow-lg border-border/50">
            <CardHeader className="bg-muted/30 border-b">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Payment History & Verification
                </CardTitle>
                <CardDescription className="mt-1">Filter, search, and verify payment records</CardDescription>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={historyStatusFilter} onValueChange={setHistoryStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="date" placeholder="From" value={historyDateFrom} onChange={(e) => setHistoryDateFrom(e.target.value)} />
                <Input type="date" placeholder="To" value={historyDateTo} onChange={(e) => setHistoryDateTo(e.target.value)} />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/20 hover:bg-muted/20">
                      <TableHead className="font-semibold">Payment ID</TableHead>
                      <TableHead className="font-semibold">Order ID</TableHead>
                      <TableHead className="font-semibold">Customer</TableHead>
                      <TableHead className="font-semibold">Amount</TableHead>
                      <TableHead className="font-semibold">Method</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Txn Ref</TableHead>
                      <TableHead className="font-semibold text-right">Verify</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                          <History className="h-12 w-12 mx-auto mb-4 opacity-20" />
                          <p className="font-medium">No records match your filters</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredHistory.map((payment) => {
                        const sc = statusConfig[payment.status];
                        const StatusIcon = sc.icon;
                        return (
                          <TableRow key={payment.id} className="hover:bg-muted/30 transition-colors">
                            <TableCell className="font-mono text-sm font-medium">{payment.id}</TableCell>
                            <TableCell className="font-mono text-sm">{payment.orderId}</TableCell>
                            <TableCell className="font-medium">{payment.customerName}</TableCell>
                            <TableCell className="font-semibold">${payment.amount.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">{methodLabels[payment.method]}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${sc.color} border gap-1`}>
                                <StatusIcon className="h-3 w-3" />
                                {sc.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">{payment.transactionRef}</TableCell>
                            <TableCell className="text-right">
                              {payment.status === "pending" ? (
                                <Button size="sm" variant="outline" className="gap-1 text-success border-success/30 hover:bg-success/10" onClick={() => updatePayment(payment.id, { status: "completed" })}>
                                  <ShieldCheck className="h-3.5 w-3.5" />
                                  Verify
                                </Button>
                              ) : (
                                <Badge variant="outline" className="text-muted-foreground">
                                  {payment.status === "completed" ? "Verified" : "Failed"}
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== TAB 3: Saved Payment Methods ===== */}
        <TabsContent value="methods" className="space-y-4">
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
        </TabsContent>
      </Tabs>

      {/* ===== Payment Add/Edit Dialog ===== */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingPayment ? "Edit Payment" : "Record New Payment"}</DialogTitle>
            <DialogDescription>{editingPayment ? "Update payment details below." : "Fill in the details to record a new payment."}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Order ID</Label>
                <Input value={paymentForm.orderId} onChange={(e) => setPaymentForm({ ...paymentForm, orderId: e.target.value })} placeholder="ORD-XXX" />
              </div>
              <div className="space-y-2">
                <Label>Amount ($)</Label>
                <Input type="number" value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: parseFloat(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Customer Name</Label>
              <Input value={paymentForm.customerName} onChange={(e) => setPaymentForm({ ...paymentForm, customerName: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={paymentForm.method} onValueChange={(v) => setPaymentForm({ ...paymentForm, method: v as PaymentMethod })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="online_transfer">Online Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={paymentForm.status} onValueChange={(v) => setPaymentForm({ ...paymentForm, status: v as PaymentStatus })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payment Date</Label>
                <Input type="date" value={paymentForm.paymentDate} onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Transaction Ref</Label>
                <Input value={paymentForm.transactionRef} onChange={(e) => setPaymentForm({ ...paymentForm, transactionRef: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
            <Button onClick={handlePaymentSubmit} className="btn-gradient">{editingPayment ? "Update" : "Record"} Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== Payment Detail Dialog ===== */}
      <Dialog open={!!viewingPayment} onOpenChange={() => setViewingPayment(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>Full details for {viewingPayment?.id}</DialogDescription>
          </DialogHeader>
          {viewingPayment && (
            <div className="space-y-4 py-2">
              {[
                ["Payment ID", viewingPayment.id],
                ["Order ID", viewingPayment.orderId],
                ["Customer", viewingPayment.customerName],
                ["Amount", `$${viewingPayment.amount.toLocaleString()}`],
                ["Method", methodLabels[viewingPayment.method]],
                ["Date", viewingPayment.paymentDate],
                ["Transaction Ref", viewingPayment.transactionRef],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="font-medium text-sm">{value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className={`${statusConfig[viewingPayment.status].color} border`}>
                  {statusConfig[viewingPayment.status].label}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ===== Saved Method Dialog ===== */}
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
