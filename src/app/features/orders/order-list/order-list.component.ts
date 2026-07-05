import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { OrderService } from '../../../core/services/order.service';
import { SupplierService } from '../../../core/services/supplier.service';
import { ProductService } from '../../../core/services/product.service';
import { OrderStatus, PurchaseOrder } from '../../../core/models/order.model';
import { Supplier } from '../../../core/models/supplier.model';
import { Product } from '../../../core/models/product.model';
import { extractErrorMessage } from '../../../core/utils/http-error';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-list.component.html'
})
export class OrderListComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly supplierService = inject(SupplierService);
  private readonly productService = inject(ProductService);

  readonly OrderStatus = OrderStatus;

  orders: PurchaseOrder[] = [];
  suppliersById = new Map<string, Supplier>();
  productsById = new Map<string, Product>();

  loading = true;
  errorMessage: string | null = null;
  pendingActionId: string | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMessage = null;

    forkJoin({
      orders: this.orderService.findAll(),
      suppliers: this.supplierService.findAll(),
      products: this.productService.findAll()
    }).subscribe({
      next: ({ orders, suppliers, products }) => {
        this.orders = [...orders].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.suppliersById = new Map(suppliers.map((s) => [s.id, s]));
        this.productsById = new Map(products.map((p) => [p.id, p]));
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = extractErrorMessage(error);
        this.loading = false;
      }
    });
  }

  supplierName(id: string): string {
    return this.suppliersById.get(id)?.name ?? id;
  }

  productName(id: string): string {
    return this.productsById.get(id)?.name ?? id;
  }

  tagClass(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.PENDING:
        return 'tag-pending';
      case OrderStatus.APPROVED:
        return 'tag-approved';
      case OrderStatus.REJECTED:
        return 'tag-rejected';
      case OrderStatus.RECEIVED:
        return 'tag-received';
      default:
        return 'tag-pending';
    }
  }

  statusLabel(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.PENDING:
        return 'Pendiente';
      case OrderStatus.APPROVED:
        return 'Aprobada';
      case OrderStatus.REJECTED:
        return 'Rechazada';
      case OrderStatus.RECEIVED:
        return 'Recibida';
      default:
        return 'Pendiente';
    }
  }

  approve(order: PurchaseOrder): void {
    this.runAction(order, this.orderService.approve(order.id));
  }

  reject(order: PurchaseOrder): void {
    this.runAction(order, this.orderService.reject(order.id));
  }

  receive(order: PurchaseOrder): void {
    this.runAction(order, this.orderService.receive(order.id));
  }

  private runAction(order: PurchaseOrder, action$: ReturnType<OrderService['approve']>): void {
    this.pendingActionId = order.id;
    this.errorMessage = null;

    action$.subscribe({
      next: (updated) => {
        this.orders = this.orders.map((o) => (o.id === updated.id ? updated : o));
        this.pendingActionId = null;
      },
      error: (error) => {
        this.errorMessage = extractErrorMessage(error);
        this.pendingActionId = null;
      }
    });
  }
}
