// Mirrors backend src/enums/AlertStatus.ts — same declaration order,
// since Express serializes TS numeric enums as plain numbers.
export enum AlertStatus {
  ACTIVE,
  CLOSED
}

export interface StockAlert {
  id: string;
  productId: string;
  quantity: number;
  status: AlertStatus;
  createdAt: string;
  closedAt: string | null;
}
