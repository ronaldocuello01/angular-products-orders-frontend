import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { ProductService } from '../../../core/services/product.service';
import { SupplierService } from '../../../core/services/supplier.service';
import { Product } from '../../../core/models/product.model';
import { Supplier } from '../../../core/models/supplier.model';
import { extractErrorMessage } from '../../../core/utils/http-error';

@Component({
  selector: 'app-stock-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stock-list.component.html'
})
export class StockListComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly supplierService = inject(SupplierService);

  products: Product[] = [];
  suppliersById = new Map<string, Supplier>();

  loading = true;
  errorMessage: string | null = null;

  ngOnInit(): void {
    forkJoin({
      products: this.productService.findAll(),
      suppliers: this.supplierService.findAll()
    }).subscribe({
      next: ({ products, suppliers }) => {
        this.products = [...products].sort((a, b) => a.name.localeCompare(b.name));
        this.suppliersById = new Map(suppliers.map((s) => [s.id, s]));
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

  isLow(product: Product): boolean {
    return product.currentStock <= product.minimumStock;
  }
}
