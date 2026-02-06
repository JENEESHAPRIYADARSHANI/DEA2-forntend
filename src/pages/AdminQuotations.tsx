import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useQuotations } from "@/contexts/QuotationContext";
import { Quotation, QuotationStatus } from "@/types/quotation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  FileText,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  ArrowRightLeft,
  Clock,
  Trash2,
  Building2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const statusConfig: Record<QuotationStatus, { label: string; icon: typeof Clock; className: string }> = {
  draft: { label: "Draft", icon: Clock, className: "bg-warning/10 text-warning border-warning/20" },
  approved: { label: "Approved", icon: CheckCircle, className: "bg-success/10 text-success border-success/20" },
  rejected: { label: "Rejected", icon: XCircle, className: "bg-destructive/10 text-destructive border-destructive/20" },
  converted: { label: "Converted", icon: ArrowRightLeft, className: "bg-primary/10 text-primary border-primary/20" },
};

const AdminQuotations = () => {
  const { quotations, updateQuotation, updateQuotationStatus, deleteQuotation, convertToOrder } = useQuotations();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [editingItems, setEditingItems] = useState<Quotation["items"] | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const filtered = quotations
    .filter(
      (q) =>
        q.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const stats = {
    total: quotations.length,
    draft: quotations.filter((q) => q.status === "draft").length,
    approved: quotations.filter((q) => q.status === "approved").length,
    converted: quotations.filter((q) => q.status === "converted").length,
  };

  const openDetail = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setEditingItems(quotation.items.map((item) => ({ ...item })));
    setAdminNotes(quotation.adminNotes || "");
    setIsDetailOpen(true);
  };

  const handleSaveChanges = () => {
    if (!selectedQuotation || !editingItems) return;
    updateQuotation(selectedQuotation.id, {
      items: editingItems,
      adminNotes,
    });
    toast.success("Quotation updated successfully");
    setIsDetailOpen(false);
  };

  const handleApprove = () => {
    if (!selectedQuotation) return;
    if (editingItems) {
      updateQuotation(selectedQuotation.id, { items: editingItems, adminNotes });
    }
    updateQuotationStatus(selectedQuotation.id, "approved");
    toast.success("Quotation approved");
    setIsDetailOpen(false);
  };

  const openRejectDialog = () => {
    setRejectionReason("");
    setIsRejectOpen(true);
  };

  const handleReject = () => {
    if (!selectedQuotation) return;
    updateQuotationStatus(selectedQuotation.id, "rejected", rejectionReason);
    toast.success("Quotation rejected");
    setIsRejectOpen(false);
    setIsDetailOpen(false);
  };

  const handleConvert = (quotation: Quotation) => {
    const orderId = convertToOrder(quotation.id);
    toast.success(`Quotation converted to order ${orderId}`);
  };

  const handleDelete = (quotation: Quotation) => {
    deleteQuotation(quotation.id);
    toast.success("Quotation deleted");
  };

  const handleItemPriceChange = (index: number, field: "unitPrice" | "discount", value: number) => {
    if (!editingItems) return;
    setEditingItems((prev) =>
      prev!.map((item, i) => {
        if (i !== index) return item;
        const updated = { ...item, [field]: value };
        updated.total = updated.quantity * updated.unitPrice * (1 - updated.discount / 100);
        return updated;
      })
    );
  };

  const editingTotal = editingItems?.reduce((sum, item) => sum + item.total, 0) || 0;

  return (
    <DashboardLayout title="Quotations" subtitle="Manage customer quotation requests">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        {[
          { label: "Total Quotations", value: stats.total, icon: FileText, color: "bg-primary/10 text-primary" },
          { label: "Pending Review", value: stats.draft, icon: Clock, color: "bg-warning/10 text-warning" },
          { label: "Approved", value: stats.approved, icon: CheckCircle, color: "bg-success/10 text-success" },
          { label: "Converted", value: stats.converted, icon: ArrowRightLeft, color: "bg-info/10 text-info" },
        ].map((stat) => (
          <Card key={stat.label} className="border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search quotations..."
            className="pl-10 bg-muted/50 border-transparent focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <Card className="border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-muted/50">
                <TableHead className="text-muted-foreground">ID</TableHead>
                <TableHead className="text-muted-foreground">Company</TableHead>
                <TableHead className="text-muted-foreground">Contact</TableHead>
                <TableHead className="text-muted-foreground">Items</TableHead>
                <TableHead className="text-muted-foreground">Total</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    No quotations found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((q) => {
                  const config = statusConfig[q.status];
                  const StatusIcon = config.icon;
                  return (
                    <TableRow key={q.id} className="border-border hover:bg-muted/30">
                      <TableCell className="font-semibold text-primary">{q.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{q.companyName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{q.contactPerson}</TableCell>
                      <TableCell>{q.items.length} product(s)</TableCell>
                      <TableCell className="font-semibold">${q.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("font-medium", config.className)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(q.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openDetail(q)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {q.status === "approved" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-primary"
                              onClick={() => handleConvert(q)}
                            >
                              <ArrowRightLeft className="h-4 w-4" />
                            </Button>
                          )}
                          {q.status === "rejected" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => handleDelete(q)}
                            >
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
        </CardContent>
      </Card>

      {/* Detail / Edit Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Quotation {selectedQuotation?.id}
            </DialogTitle>
          </DialogHeader>

          {selectedQuotation && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid gap-3 sm:grid-cols-2 p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="text-xs text-muted-foreground">Company</p>
                  <p className="font-medium">{selectedQuotation.companyName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Contact</p>
                  <p className="font-medium">{selectedQuotation.contactPerson}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedQuotation.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedQuotation.phone || "N/A"}</p>
                </div>
              </div>

              {/* Items - Editable */}
              <div>
                <h3 className="font-semibold mb-3">Products</h3>
                <div className="space-y-3">
                  {editingItems?.map((item, index) => (
                    <div
                      key={index}
                      className="grid gap-3 sm:grid-cols-[1fr_90px_90px_90px] items-end p-3 rounded-lg border border-border"
                    >
                      <div>
                        <Label className="text-xs">Product</Label>
                        <p className="font-medium text-sm">{item.productName} × {item.quantity}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Unit Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => handleItemPriceChange(index, "unitPrice", parseFloat(e.target.value) || 0)}
                          disabled={selectedQuotation.status === "approved" || selectedQuotation.status === "converted"}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Discount %</Label>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={item.discount}
                          onChange={(e) => handleItemPriceChange(index, "discount", parseFloat(e.target.value) || 0)}
                          disabled={selectedQuotation.status === "approved" || selectedQuotation.status === "converted"}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Line Total</Label>
                        <p className="font-semibold text-sm text-primary">${item.total.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-3 text-lg">
                  <span className="mr-3 font-medium">Total:</span>
                  <span className="font-bold text-primary">${editingTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Special Notes */}
              {selectedQuotation.specialNotes && (
                <div>
                  <h3 className="font-semibold mb-2">Customer Notes</h3>
                  <p className="text-sm text-muted-foreground p-3 rounded-lg bg-muted/50">
                    {selectedQuotation.specialNotes}
                  </p>
                </div>
              )}

              {/* Admin Notes */}
              <div className="space-y-2">
                <Label>Admin Notes</Label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Internal notes about this quotation..."
                  rows={3}
                  disabled={selectedQuotation.status === "approved" || selectedQuotation.status === "converted"}
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex-wrap gap-2">
            {selectedQuotation?.status === "draft" && (
              <>
                <Button variant="outline" onClick={handleSaveChanges}>
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  className="text-destructive border-destructive/50 hover:bg-destructive/10"
                  onClick={openRejectDialog}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button className="btn-gradient gap-1" onClick={handleApprove}>
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </Button>
              </>
            )}
            {selectedQuotation?.status === "approved" && (
              <Button
                className="btn-gradient gap-1"
                onClick={() => {
                  handleConvert(selectedQuotation);
                  setIsDetailOpen(false);
                }}
              >
                <ArrowRightLeft className="h-4 w-4" />
                Convert to Order
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Reject Quotation
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label>Reason for rejection</Label>
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Provide a reason for rejecting this quotation..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
            >
              Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminQuotations;
