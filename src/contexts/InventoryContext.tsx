import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { InventoryItem } from "@/types/inventory";
import {
  fetchInventory,
  createInventory,
  updateInventory,
  deleteInventory,
} from "@/services/inventoryApi";

interface InventoryContextType {
  items: InventoryItem[];
  addItem: (
    data: Omit<InventoryItem, "id" | "lastUpdated" | "createdAt">
  ) => Promise<InventoryItem>;
  updateItem: (
    id: string,
    updates: Partial<Pick<InventoryItem, "quantityInStock" | "reorderLevel">>
  ) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  increaseStock: (id: string, amount: number) => void;
  reduceStock: (id: string, amount: number) => void;
  getItem: (id: string) => InventoryItem | undefined;
}

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>([]);

  // FETCH INVENTORY (READ)
  useEffect(() => {
    fetchInventory()
      .then((data) => {
        const mapped = data.map((i: any) => ({
          id: String(i.inventoryId),
          productId: String(i.productId),
          productName: "Product " + i.productId, // placeholder
          category: "N/A",
          quantityInStock: i.quantityInStock,
          reorderLevel: i.reorderLevel,
          lastUpdated: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        }));
        setItems(mapped);
      })
      .catch(console.error);
  }, []);

  // CREATE
  const addItem = async (data: {
    productId: string;
    productName: string;
    category: string;
    quantityInStock: number;
    reorderLevel: number;
  }) => {
    const created = await createInventory({
      productId: Number(data.productId),
      quantityInStock: data.quantityInStock,
      reorderLevel: data.reorderLevel,
    });

    const mapped: InventoryItem = {
      id: String(created.inventoryId),
      productId: String(created.productId),
      productName: data.productName,
      category: data.category,
      quantityInStock: created.quantityInStock,
      reorderLevel: created.reorderLevel,
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    setItems((prev) => [...prev, mapped]);
    return mapped;
  };

  // UPDATE
  const updateItem = async (
    id: string,
    updates: { quantityInStock?: number; reorderLevel?: number }
  ) => {
    const updated = await updateInventory(Number(id), updates);

    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantityInStock: updated.quantityInStock,
              reorderLevel: updated.reorderLevel,
              lastUpdated: new Date().toISOString(),
            }
          : item
      )
    );
  };

  // DELETE
  const deleteItem = async (id: string) => {
    await deleteInventory(Number(id));
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // STOCK ADJUSTMENTS
  const increaseStock = (id: string, amount: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    updateItem(id, { quantityInStock: item.quantityInStock + amount });
  };

  const reduceStock = (id: string, amount: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    updateItem(id, {
      quantityInStock: Math.max(0, item.quantityInStock - amount),
    });
  };

  const getItem = (id: string) => items.find((item) => item.id === id);

  return (
    <InventoryContext.Provider
      value={{
        items,
        addItem,
        updateItem,
        deleteItem,
        increaseStock,
        reduceStock,
        getItem,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within InventoryProvider");
  }
  return context;
}
