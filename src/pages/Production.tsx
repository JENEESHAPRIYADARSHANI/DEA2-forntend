import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Factory,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Package,
  TrendingUp,
  ChevronDown,
  Pencil,
} from "lucide-react";

interface ProductionBatch {
  id: string;
  product: string;
  quantity: number;
  startDate: string;
  endDate: string;
  status: "planned" | "in_progress" | "completed";
}

const initialBatches: ProductionBatch[] = [
  {
    id: "PB-001",
    product: "Premium Leather Tote",
    quantity: 150,
    startDate: "2024-01-15",
    endDate: "2024-01-25",
    status: "in_progress",
  },
  {
    id: "PB-002",
    product: "Canvas Messenger Bag",
    quantity: 200,
    startDate: "2024-01-10",
    endDate: "2024-01-20",
    status: "completed",
  },
  {
    id: "PB-003",
    product: "Executive Briefcase",
    quantity: 75,
    startDate: "2024-01-18",
    endDate: "2024-01-30",
    status: "in_progress",
  },
  {
    id: "PB-004",
    product: "Sports Duffel Bag",
    quantity: 100,
    startDate: "2024-01-22",
    endDate: "2024-02-05",
    status: "planned",
  },
  {
    id: "PB-005",
    product: "Laptop Backpack",
    quantity: 180,
    startDate: "2024-01-05",
    endDate: "2024-01-18",
    status: "completed",
  },
  {
    id: "PB-006",
    product: "Ladies Clutch Purse",
    quantity: 250,
    startDate: "2024-01-20",
    endDate: "2024-02-01",
    status: "in_progress",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return (
        <Badge className="bg-success/20 text-success border-success/30">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    case "in_progress":
      return (
        <Badge className="bg-info/20 text-info border-info/30">
          <Clock className="h-3 w-3 mr-1" />
          In Progress
        </Badge>
      );
    case "planned":
      return (
        <Badge className="bg-warning/20 text-warning border-warning/30">
          <AlertCircle className="h-3 w-3 mr-1" />
          Planned
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "completed":
      return "Completed";
    case "in_progress":
      return "In Progress";
    case "planned":
      return "Planned";
    default:
      return status;
  }
};

const Production = () => {
  const [batches, setBatches] = useState<ProductionBatch[]>(initialBatches);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<ProductionBatch | null>(null);
  const [formData, setFormData] = useState({
    product: "",
    quantity: "",
    startDate: "",
    endDate: "",
    status: "planned" as "planned" | "in_progress" | "completed",
  });

  const totalBatches = batches.length;
  const completedBatches = batches.filter((b) => b.status === "completed").length;
  const inProgressBatches = batches.filter((b) => b.status === "in_progress").length;
  const plannedBatches = batches.filter((b) => b.status === "planned").length;

  const resetForm = () => {
    setFormData({
      product: "",
      quantity: "",
      startDate: "",
      endDate: "",
      status: "planned",
    });
    setEditingBatch(null);
  };

  const handleOpenDialog = (batch?: ProductionBatch) => {
    if (batch) {
      setEditingBatch(batch);
      setFormData({
        product: batch.product,
        quantity: batch.quantity.toString(),
        startDate: batch.startDate,
        endDate: batch.endDate,
        status: batch.status,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = () => {
    if (!formData.product || !formData.quantity || !formData.startDate || !formData.endDate) {
      return;
    }

    if (editingBatch) {
      setBatches((prev) =>
        prev.map((batch) =>
          batch.id === editingBatch.id
            ? {
                ...batch,
                product: formData.product,
                quantity: parseInt(formData.quantity),
                startDate: formData.startDate,
                endDate: formData.endDate,
                status: formData.status,
              }
            : batch
        )
      );
    } else {
      const newBatch: ProductionBatch = {
        id: `PB-${String(batches.length + 1).padStart(3, "0")}`,
        product: formData.product,
        quantity: parseInt(formData.quantity),
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
      };
      setBatches((prev) => [...prev, newBatch]);
    }

    handleCloseDialog();
  };

  const handleUpdateStatus = (batchId: string, newStatus: "planned" | "in_progress" | "completed") => {
    setBatches((prev) =>
      prev.map((batch) =>
        batch.id === batchId ? { ...batch, status: newStatus } : batch
      )
    );
  };

  return (
    <DashboardLayout
      title="Production"
      subtitle="Manage production batches and track manufacturing progress"
    >
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Batches</p>
                <p className="text-3xl font-bold text-foreground">{totalBatches}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Factory className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Planned</p>
                <p className="text-3xl font-bold text-foreground">{plannedBatches}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
                <AlertCircle className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-3xl font-bold text-foreground">{inProgressBatches}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-info/10">
                <Clock className="h-6 w-6 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-foreground">{completedBatches}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Production Batches Table */}
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display text-lg font-semibold">
            Production Batches
          </CardTitle>
          <Button className="btn-gradient" onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            New Batch
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Batch ID</TableHead>
                <TableHead className="text-muted-foreground">Product</TableHead>
                <TableHead className="text-muted-foreground">Quantity</TableHead>
                <TableHead className="text-muted-foreground">Start Date</TableHead>
                <TableHead className="text-muted-foreground">End Date</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.map((batch) => (
                <TableRow key={batch.id} className="border-border">
                  <TableCell className="font-medium text-foreground">
                    {batch.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">{batch.product}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">{batch.quantity}</TableCell>
                  <TableCell className="text-muted-foreground">{batch.startDate}</TableCell>
                  <TableCell className="text-muted-foreground">{batch.endDate}</TableCell>
                  <TableCell>{getStatusBadge(batch.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            Status
                            <ChevronDown className="h-4 w-4 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleUpdateStatus(batch.id, "planned")}>
                            <AlertCircle className="h-4 w-4 mr-2 text-warning" />
                            Planned
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(batch.id, "in_progress")}>
                            <Clock className="h-4 w-4 mr-2 text-info" />
                            In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(batch.id, "completed")}>
                            <CheckCircle2 className="h-4 w-4 mr-2 text-success" />
                            Completed
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog(batch)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Production Insights */}
      <div className="grid gap-6 lg:grid-cols-2 mt-8">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="font-display text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Production Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">On-time Delivery Rate</span>
                <span className="font-semibold text-success">92%</span>
              </div>
              <Progress value={92} className="h-2" />

              <div className="flex items-center justify-between mt-4">
                <span className="text-muted-foreground">Quality Pass Rate</span>
                <span className="font-semibold text-success">98%</span>
              </div>
              <Progress value={98} className="h-2" />

              <div className="flex items-center justify-between mt-4">
                <span className="text-muted-foreground">Resource Utilization</span>
                <span className="font-semibold text-info">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="font-display text-lg font-semibold flex items-center gap-2">
              <Factory className="h-5 w-5 text-primary" />
              Material Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { material: "Leather (sq ft)", required: 500, available: 350, unit: "sq ft" },
                { material: "Canvas Fabric", required: 300, available: 450, unit: "yards" },
                { material: "Zippers", required: 400, available: 380, unit: "pcs" },
                { material: "Metal Buckles", required: 200, available: 220, unit: "pcs" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="font-medium text-foreground">{item.material}</span>
                  <div className="text-right">
                    <span className={item.available >= item.required ? "text-success" : "text-destructive"}>
                      {item.available}
                    </span>
                    <span className="text-muted-foreground"> / {item.required} {item.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Batch Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingBatch ? "Edit Batch" : "Add New Batch"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="product">Product</Label>
              <Input
                id="product"
                placeholder="Enter product name"
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "planned" | "in_progress" | "completed") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button className="btn-gradient" onClick={handleSubmit}>
              {editingBatch ? "Save Changes" : "Add Batch"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Production;
