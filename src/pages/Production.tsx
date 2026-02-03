import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Factory,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Package,
  Users,
  Calendar,
  TrendingUp,
} from "lucide-react";

const productionBatches = [
  {
    id: "PB-001",
    product: "Premium Leather Tote",
    quantity: 150,
    completed: 120,
    startDate: "2024-01-15",
    dueDate: "2024-01-25",
    status: "in_progress",
    workers: 4,
    materials: "Leather, Thread, Zipper",
  },
  {
    id: "PB-002",
    product: "Canvas Messenger Bag",
    quantity: 200,
    completed: 200,
    startDate: "2024-01-10",
    dueDate: "2024-01-20",
    status: "completed",
    workers: 5,
    materials: "Canvas, Cotton Strap, Buckle",
  },
  {
    id: "PB-003",
    product: "Executive Briefcase",
    quantity: 75,
    completed: 30,
    startDate: "2024-01-18",
    dueDate: "2024-01-30",
    status: "in_progress",
    workers: 3,
    materials: "Leather, Metal Frame, Lock",
  },
  {
    id: "PB-004",
    product: "Sports Duffel Bag",
    quantity: 100,
    completed: 0,
    startDate: "2024-01-22",
    dueDate: "2024-02-05",
    status: "pending",
    workers: 0,
    materials: "Nylon, Polyester Lining, Zipper",
  },
  {
    id: "PB-005",
    product: "Laptop Backpack",
    quantity: 180,
    completed: 180,
    startDate: "2024-01-05",
    dueDate: "2024-01-18",
    status: "completed",
    workers: 6,
    materials: "Polyester, Foam Padding, Buckle",
  },
  {
    id: "PB-006",
    product: "Ladies Clutch Purse",
    quantity: 250,
    completed: 100,
    startDate: "2024-01-20",
    dueDate: "2024-02-01",
    status: "in_progress",
    workers: 4,
    materials: "Satin, Sequins, Clasp",
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
    case "pending":
      return (
        <Badge className="bg-warning/20 text-warning border-warning/30">
          <AlertCircle className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const Production = () => {
  const totalBatches = productionBatches.length;
  const completedBatches = productionBatches.filter(b => b.status === "completed").length;
  const inProgressBatches = productionBatches.filter(b => b.status === "in_progress").length;
  const totalUnitsProduced = productionBatches.reduce((sum, b) => sum + b.completed, 0);

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

        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Units Produced</p>
                <p className="text-3xl font-bold text-foreground">{totalUnitsProduced}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
                <Package className="h-6 w-6 text-warning" />
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
          <Button className="btn-gradient">
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
                <TableHead className="text-muted-foreground">Progress</TableHead>
                <TableHead className="text-muted-foreground">Timeline</TableHead>
                <TableHead className="text-muted-foreground">Workers</TableHead>
                <TableHead className="text-muted-foreground">Materials</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productionBatches.map((batch) => {
                const progress = Math.round((batch.completed / batch.quantity) * 100);
                return (
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
                    <TableCell>
                      <div className="w-32">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">
                            {batch.completed}/{batch.quantity}
                          </span>
                          <span className="font-medium text-foreground">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{batch.startDate}</span>
                        <span>→</span>
                        <span>{batch.dueDate}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-foreground">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{batch.workers}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground max-w-[150px] truncate block">
                        {batch.materials}
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(batch.status)}</TableCell>
                  </TableRow>
                );
              })}
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
    </DashboardLayout>
  );
};

export default Production;
