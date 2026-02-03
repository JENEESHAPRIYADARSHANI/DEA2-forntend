
# Production Page Update Plan

## Overview
Update the Production page to simplify the table structure and add a modal form for creating new production batches.

---

## Changes Summary

### 1. Simplify Production Batches Table

**Current columns being removed:**
- Progress (with progress bar)
- Workers
- Materials

**New simplified table structure:**

| Batch_ID | Product | Quantity | Start_Date | End_Date | Status | Actions |
|----------|---------|----------|------------|----------|--------|---------|
| PB-001 | Premium Leather Tote | 150 | 2024-01-15 | 2024-01-25 | In Progress | [Update Status] [Edit] |

### 2. Add "New Batch" Dialog Form

A modal dialog will open when clicking the "New Batch" button with these form fields:

- **Product** - Text input for product name
- **Quantity** - Number input for batch quantity
- **Start_Date** - Date input for production start
- **End_Date** - Date input for expected completion
- **Status** - Dropdown with options:
  - Planned
  - In Progress
  - Completed

### 3. Action Buttons Per Row

Each table row will have two action buttons:
- **Update Status** - Opens a dropdown/dialog to quickly change the batch status
- **Edit** - Opens the batch form pre-filled with existing data for editing

---

## Technical Details

### File to Modify
`src/pages/Production.tsx`

### Components Used
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter` - For the form modal
- `Select`, `SelectTrigger`, `SelectContent`, `SelectItem` - For status dropdown
- `Input` - For text and date fields
- `Label` - For form field labels
- `Button` - For form actions and table row actions
- `DropdownMenu` - For the "Update Status" quick action

### State Management
- `useState` for managing the batches list
- `useState` for controlling dialog open/close state
- `useState` for form input values
- `useState` for tracking which batch is being edited (if any)

### Data Structure Update
```typescript
interface ProductionBatch {
  id: string;
  product: string;
  quantity: number;
  startDate: string;
  endDate: string;
  status: "planned" | "in_progress" | "completed";
}
```

### Status Mapping
- "Planned" maps to `planned` (will use warning/yellow badge)
- "In Progress" maps to `in_progress` (uses info/blue badge)
- "Completed" maps to `completed` (uses success/green badge)

---

## Implementation Steps

1. **Update imports** - Add Dialog, Select, Input, Label, DropdownMenu components

2. **Simplify data structure** - Remove `completed`, `workers`, `materials` fields from batch data; rename `dueDate` to `endDate`; change `pending` status to `planned`

3. **Add state hooks** - Create state for batches array, dialog visibility, form data, and edit mode

4. **Create form handlers**:
   - `handleAddBatch()` - Adds new batch to the list
   - `handleEditBatch()` - Updates existing batch
   - `handleUpdateStatus()` - Quick status change from table
   - `handleDeleteBatch()` - Optional: remove a batch

5. **Rebuild table columns** - Batch_ID, Product, Quantity, Start_Date, End_Date, Status, Actions

6. **Build the dialog form** - Create the "Add New Batch" modal with all form fields and validation

7. **Add action buttons to each row** - "Update Status" dropdown and "Edit" button

---

## Visual Preview

### Table Layout
```
+----------+---------------------+----------+------------+------------+-------------+------------------+
| Batch ID | Product             | Quantity | Start Date | End Date   | Status      | Actions          |
+----------+---------------------+----------+------------+------------+-------------+------------------+
| PB-001   | Premium Leather Tote| 150      | 2024-01-15 | 2024-01-25 | In Progress | [Status▼] [Edit] |
| PB-002   | Canvas Messenger    | 200      | 2024-01-10 | 2024-01-20 | Completed   | [Status▼] [Edit] |
+----------+---------------------+----------+------------+------------+-------------+------------------+
```

### Form Dialog Layout
```
+----------------------------------+
|  Add New Batch              [X]  |
+----------------------------------+
|  Product                         |
|  [________________________]      |
|                                  |
|  Quantity                        |
|  [________________________]      |
|                                  |
|  Start Date                      |
|  [________________________]      |
|                                  |
|  End Date                        |
|  [________________________]      |
|                                  |
|  Status                          |
|  [Planned              ▼]        |
|                                  |
|         [Cancel] [Add Batch]     |
+----------------------------------+
```

---

## Notes
- The stats cards at the top will be updated to reflect the new status naming (Planned instead of Pending)
- The Production Efficiency and Material Requirements sections at the bottom will remain unchanged
- Form validation will ensure all fields are filled before submission
- Edit mode will pre-populate the form with existing batch data
