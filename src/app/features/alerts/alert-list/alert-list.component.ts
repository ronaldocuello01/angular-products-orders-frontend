import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { AlertService } from '../../../core/services/alert.service';
import { ProductService } from '../../../core/services/product.service';
import { AlertStatus, StockAlert } from '../../../core/models/alert.model';
import { Product } from '../../../core/models/product.model';
import { extractErrorMessage } from '../../../core/utils/http-error';

@Component({
  selector: 'app-alert-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alert-list.component.html'
})
export class AlertListComponent implements OnInit {
  private readonly alertService = inject(AlertService);
  private readonly productService = inject(ProductService);

  readonly AlertStatus = AlertStatus;

  alerts: StockAlert[] = [];
  productsById = new Map<string, Product>();

  onlyActive = true;
  loading = true;
  errorMessage: string | null = null;

  ngOnInit(): void {
    forkJoin({
      alerts: this.alertService.findAll(),
      products: this.productService.findAll()
    }).subscribe({
      next: ({ alerts, products }) => {
        this.alerts = [...alerts].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.productsById = new Map(products.map((p) => [p.id, p]));
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = extractErrorMessage(error);
        this.loading = false;
      }
    });
  }

  get visibleAlerts(): StockAlert[] {
    return this.onlyActive
      ? this.alerts.filter((a) => a.status === AlertStatus.ACTIVE)
      : this.alerts;
  }

  productName(id: string): string {
    return this.productsById.get(id)?.name ?? id;
  }
}
