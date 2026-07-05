// Mirrors backend src/enums/OrderStatus.ts — same declaration order,
// since Express serializes TS numeric enums as plain numbers.
export enum OrderStatus {
  PENDING,
  APPROVED,
  REJECTED,
  RECEIVED
}

export interface PurchaseOrderItem {
  productId: string;
  quantity: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  items: PurchaseOrderItem[];
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItemDTO {
  productId: string;
  quantity: number;
}

export interface CreatePurchaseOrderDTO {
  supplierId: string;
  items: PurchaseOrderItemDTO[];
}
