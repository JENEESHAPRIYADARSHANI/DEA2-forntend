import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Plus,
  Pencil,
  Trash2,
  Truck,
  Package,
  Link2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

// Types
interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: "active" | "inactive";
}

interface Material {
  id: string;
  name: string;
  type: string;
  unit: string;
  unitPrice: number;
  reorderLevel: number;
  status: "active" | "disabled";
}

interface SupplierMaterialMapping {
  id: string;
  supplierId: string;
  materialId: string;
  supplyPrice: number;
  leadTimeDays: number;
}

// Initial Data
const initialSuppliers: Supplier[] = [
  {
    id: "SUP-001",
    name: "Premium Leather Co.",
    email: "contact@premiumleather.com",
    phone: "+1 555-0101",
    address: "123 Leather Lane, Boston, MA",
    status: "active",
  },
  {
    id: "SUP-002",
    name: "Global Fabrics Ltd.",
    email: "sales@globalfabrics.com",
    phone: "+1 555-0102",
    address: "456 Textile Ave, New York, NY",
    status: "active",
  },
  {
    id: "SUP-003",
    name: "Metal Hardware Inc.",
    email: "info@metalhardware.com",
    phone: "+1 555-0103",
    address: "789 Industrial Blvd, Chicago, IL",
    status: "inactive",
  },
];

const initialMaterials: Material[] = [
  {
    id: "MAT-001",
    name: "Italian Leather",
    type: "Leather",
    unit: "sq ft",
    unitPrice: 12.5,
    reorderLevel: 100,
    status: "active",
  },
  {
    id: "MAT-002",
    name: "Canvas Fabric",
    type: "Fabric",
    unit: "meter",
    unitPrice: 8.0,
    reorderLevel: 200,
    status: "active",
  },
  {
    id: "MAT-003",
    name: "Brass Zipper",
    type: "Hardware",
    unit: "piece",
    unitPrice: 2.5,
    reorderLevel: 500,
    status: "active",
  },
  {
    id: "MAT-004",
    name: "Nylon Thread",
    type: "Thread",
    unit: "spool",
    unitPrice: 3.0,
    reorderLevel: 150,
    status: "disabled",
  },
];

const initialMappings: SupplierMaterialMapping[] = [
  {
    id: "MAP-001",
    supplierId: "SUP-001",
    materialId: "MAT-001",
    supplyPrice: 11.0,
    leadTimeDays: 7,
  },
  {
    id: "MAP-002",
    supplierId: "SUP-002",
    materialId: "MAT-002",
    supplyPrice: 7.5,
    leadTimeDays: 5,
  },
  {
    id: "MAP-003",
    supplierId: "SUP-003",
    materialId: "MAT-003",
    supplyPrice: 2.25,
    leadTimeDays: 3,
  },
];

export default function Suppliers() {
  // Supplier State
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [supplierForm, setSupplierForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "active" as "active" | "inactive",
  });

  // Material State
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [materialForm, setMaterialForm] = useState({
    name: "",
    type: "",
    unit: "",
    unitPrice: 0,
    reorderLevel: 0,
    status: "active" as "active" | "disabled",
  });

  // Mapping State
  const [mappings, setMappings] = useState<SupplierMaterialMapping[]>(initialMappings);
  const [mappingDialogOpen, setMappingDialogOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState<SupplierMaterialMapping | null>(null);
  const [mappingForm, setMappingForm] = useState({
    supplierId: "",
    materialId: "",
    supplyPrice: 0,
    leadTimeDays: 0,
  });

  // Supplier Handlers
  const openSupplierDialog = (supplier?: Supplier) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setSupplierForm({
        name: supplier.name,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
        status: supplier.status,
      });
    } else {
      setEditingSupplier(null);
      setSupplierForm({ name: "", email: "", phone: "", address: "", status: "active" });
    }
    setSupplierDialogOpen(true);
  };

  const handleSupplierSubmit = () => {
    if (editingSupplier) {
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === editingSupplier.id ? { ...s, ...supplierForm } : s
        )
      );
    } else {
      const newSupplier: Supplier = {
        id: `SUP-${String(suppliers.length + 1).padStart(3, "0")}`,
        ...supplierForm,
      };
      setSuppliers((prev) => [...prev, newSupplier]);
    }
    setSupplierDialogOpen(false);
  };

  const toggleSupplierStatus = (id: string) => {
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "active" ? "inactive" : "active" }
          : s
      )
    );
  };

  const deleteSupplier = (id: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  };

  // Material Handlers
  const openMaterialDialog = (material?: Material) => {
    if (material) {
      setEditingMaterial(material);
      setMaterialForm({
        name: material.name,
        type: material.type,
        unit: material.unit,
        unitPrice: material.unitPrice,
        reorderLevel: material.reorderLevel,
        status: material.status,
      });
    } else {
      setEditingMaterial(null);
      setMaterialForm({ name: "", type: "", unit: "", unitPrice: 0, reorderLevel: 0, status: "active" });
    }
    setMaterialDialogOpen(true);
  };

  const handleMaterialSubmit = () => {
    if (editingMaterial) {
      setMaterials((prev) =>
        prev.map((m) =>
          m.id === editingMaterial.id ? { ...m, ...materialForm } : m
        )
      );
    } else {
      const newMaterial: Material = {
        id: `MAT-${String(materials.length + 1).padStart(3, "0")}`,
        ...materialForm,
      };
      setMaterials((prev) => [...prev, newMaterial]);
    }
    setMaterialDialogOpen(false);
  };

  const toggleMaterialStatus = (id: string) => {
    setMaterials((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === "active" ? "disabled" : "active" }
          : m
      )
    );
  };

  const deleteMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  // Mapping Handlers
  const openMappingDialog = (mapping?: SupplierMaterialMapping) => {
    if (mapping) {
      setEditingMapping(mapping);
      setMappingForm({
        supplierId: mapping.supplierId,
        materialId: mapping.materialId,
        supplyPrice: mapping.supplyPrice,
        leadTimeDays: mapping.leadTimeDays,
      });
    } else {
      setEditingMapping(null);
      setMappingForm({ supplierId: "", materialId: "", supplyPrice: 0, leadTimeDays: 0 });
    }
    setMappingDialogOpen(true);
  };

  const handleMappingSubmit = () => {
    if (editingMapping) {
      setMappings((prev) =>
        prev.map((m) =>
          m.id === editingMapping.id ? { ...m, ...mappingForm } : m
        )
      );
    } else {
      const newMapping: SupplierMaterialMapping = {
        id: `MAP-${String(mappings.length + 1).padStart(3, "0")}`,
        ...mappingForm,
      };
      setMappings((prev) => [...prev, newMapping]);
    }
    setMappingDialogOpen(false);
  };

  const deleteMapping = (id: string) => {
    setMappings((prev) => prev.filter((m) => m.id !== id));
  };

  // Helper functions
  const getSupplierName = (id: string) => suppliers.find((s) => s.id === id)?.name || "Unknown";
  const getMaterialName = (id: string) => materials.find((m) => m.id === id)?.name || "Unknown";

  return (
    <DashboardLayout
      title="Suppliers"
      subtitle="Manage suppliers, materials, and their relationships"
    >
      <Tabs defaultValue="suppliers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[500px]">
          <TabsTrigger value="suppliers" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Suppliers
          </TabsTrigger>
          <TabsTrigger value="materials" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Materials
          </TabsTrigger>
          <TabsTrigger value="mapping" className="flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            Mapping
          </TabsTrigger>
        </TabsList>

        {/* Suppliers Tab */}
        <TabsContent value="suppliers">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Supplier Management</CardTitle>
              <Button onClick={() => openSupplierDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Supplier
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.id}</TableCell>
                      <TableCell>{supplier.name}</TableCell>
                      <TableCell>{supplier.email}</TableCell>
                      <TableCell>{supplier.phone}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{supplier.address}</TableCell>
                      <TableCell>
                        <Badge
                          variant={supplier.status === "active" ? "default" : "secondary"}
                        >
                          {supplier.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleSupplierStatus(supplier.id)}
                          >
                            {supplier.status === "active" ? (
                              <ToggleRight className="h-4 w-4" />
                            ) : (
                              <ToggleLeft className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openSupplierDialog(supplier)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => deleteSupplier(supplier.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Materials Tab */}
        <TabsContent value="materials">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Material Management</CardTitle>
              <Button onClick={() => openMaterialDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Material
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Material Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Reorder Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">{material.id}</TableCell>
                      <TableCell>{material.name}</TableCell>
                      <TableCell>{material.type}</TableCell>
                      <TableCell>{material.unit}</TableCell>
                      <TableCell>${material.unitPrice.toFixed(2)}</TableCell>
                      <TableCell>{material.reorderLevel}</TableCell>
                      <TableCell>
                        <Badge
                          variant={material.status === "active" ? "default" : "secondary"}
                        >
                          {material.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleMaterialStatus(material.id)}
                          >
                            {material.status === "active" ? (
                              <ToggleRight className="h-4 w-4" />
                            ) : (
                              <ToggleLeft className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openMaterialDialog(material)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => deleteMaterial(material.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mapping Tab */}
        <TabsContent value="mapping">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Supplier–Material Mapping</CardTitle>
              <Button onClick={() => openMappingDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Mapping
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Supply Price</TableHead>
                    <TableHead>Lead Time (Days)</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mappings.map((mapping) => (
                    <TableRow key={mapping.id}>
                      <TableCell className="font-medium">{mapping.id}</TableCell>
                      <TableCell>{getSupplierName(mapping.supplierId)}</TableCell>
                      <TableCell>{getMaterialName(mapping.materialId)}</TableCell>
                      <TableCell>${mapping.supplyPrice.toFixed(2)}</TableCell>
                      <TableCell>{mapping.leadTimeDays} days</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openMappingDialog(mapping)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => deleteMapping(mapping.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Supplier Dialog */}
      <Dialog open={supplierDialogOpen} onOpenChange={setSupplierDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="supplier-name">Name</Label>
              <Input
                id="supplier-name"
                value={supplierForm.name}
                onChange={(e) =>
                  setSupplierForm({ ...supplierForm, name: e.target.value })
                }
                placeholder="Supplier name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier-email">Email</Label>
              <Input
                id="supplier-email"
                type="email"
                value={supplierForm.email}
                onChange={(e) =>
                  setSupplierForm({ ...supplierForm, email: e.target.value })
                }
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier-phone">Phone</Label>
              <Input
                id="supplier-phone"
                value={supplierForm.phone}
                onChange={(e) =>
                  setSupplierForm({ ...supplierForm, phone: e.target.value })
                }
                placeholder="+1 555-0100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier-address">Address</Label>
              <Input
                id="supplier-address"
                value={supplierForm.address}
                onChange={(e) =>
                  setSupplierForm({ ...supplierForm, address: e.target.value })
                }
                placeholder="123 Main St, City, State"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier-status">Status</Label>
              <Select
                value={supplierForm.status}
                onValueChange={(value: "active" | "inactive") =>
                  setSupplierForm({ ...supplierForm, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSupplierDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSupplierSubmit}>
              {editingSupplier ? "Update" : "Add"} Supplier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Material Dialog */}
      <Dialog open={materialDialogOpen} onOpenChange={setMaterialDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingMaterial ? "Edit Material" : "Add New Material"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="material-name">Material Name</Label>
              <Input
                id="material-name"
                value={materialForm.name}
                onChange={(e) =>
                  setMaterialForm({ ...materialForm, name: e.target.value })
                }
                placeholder="Material name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="material-type">Type</Label>
              <Input
                id="material-type"
                value={materialForm.type}
                onChange={(e) =>
                  setMaterialForm({ ...materialForm, type: e.target.value })
                }
                placeholder="e.g., Leather, Fabric, Hardware"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="material-unit">Unit</Label>
              <Input
                id="material-unit"
                value={materialForm.unit}
                onChange={(e) =>
                  setMaterialForm({ ...materialForm, unit: e.target.value })
                }
                placeholder="e.g., sq ft, meter, piece"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="material-price">Unit Price ($)</Label>
              <Input
                id="material-price"
                type="number"
                step="0.01"
                value={materialForm.unitPrice}
                onChange={(e) =>
                  setMaterialForm({ ...materialForm, unitPrice: parseFloat(e.target.value) || 0 })
                }
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="material-reorder">Reorder Level</Label>
              <Input
                id="material-reorder"
                type="number"
                value={materialForm.reorderLevel}
                onChange={(e) =>
                  setMaterialForm({ ...materialForm, reorderLevel: parseInt(e.target.value) || 0 })
                }
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="material-status">Status</Label>
              <Select
                value={materialForm.status}
                onValueChange={(value: "active" | "disabled") =>
                  setMaterialForm({ ...materialForm, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMaterialDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleMaterialSubmit}>
              {editingMaterial ? "Update" : "Add"} Material
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mapping Dialog */}
      <Dialog open={mappingDialogOpen} onOpenChange={setMappingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingMapping ? "Edit Mapping" : "Add Supplier-Material Mapping"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="mapping-supplier">Supplier</Label>
              <Select
                value={mappingForm.supplierId}
                onValueChange={(value) =>
                  setMappingForm({ ...mappingForm, supplierId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers
                    .filter((s) => s.status === "active")
                    .map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mapping-material">Material</Label>
              <Select
                value={mappingForm.materialId}
                onValueChange={(value) =>
                  setMappingForm({ ...mappingForm, materialId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  {materials
                    .filter((m) => m.status === "active")
                    .map((material) => (
                      <SelectItem key={material.id} value={material.id}>
                        {material.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mapping-price">Supply Price ($)</Label>
              <Input
                id="mapping-price"
                type="number"
                step="0.01"
                value={mappingForm.supplyPrice}
                onChange={(e) =>
                  setMappingForm({ ...mappingForm, supplyPrice: parseFloat(e.target.value) || 0 })
                }
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mapping-leadtime">Lead Time (Days)</Label>
              <Input
                id="mapping-leadtime"
                type="number"
                value={mappingForm.leadTimeDays}
                onChange={(e) =>
                  setMappingForm({ ...mappingForm, leadTimeDays: parseInt(e.target.value) || 0 })
                }
                placeholder="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMappingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleMappingSubmit}>
              {editingMapping ? "Update" : "Add"} Mapping
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
