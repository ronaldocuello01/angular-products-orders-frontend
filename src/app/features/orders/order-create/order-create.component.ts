import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { forkJoin } from 'rxjs';

import { SupplierService } from '../../../core/services/supplier.service';
import { ProductService } from '../../../core/services/product.service';
import { OrderService } from '../../../core/services/order.service';
import { Supplier } from '../../../core/models/supplier.model';
import { Product } from '../../../core/models/product.model';
import { extractErrorMessage } from '../../../core/utils/http-error';

@Component({
  selector: 'app-order-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './order-create.component.html'
})
export class OrderCreateComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly supplierService = inject(SupplierService);
  private readonly productService = inject(ProductService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  suppliers: Supplier[] = [];
  products: Product[] = [];

  loading = true;
  submitting = false;
  errorMessage: string | null = null;

  form = this.fb.nonNullable.group({
    supplierId: ['', Validators.required],
    items: this.fb.array([this.buildItem()])
  });

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  ngOnInit(): void {
    forkJoin({
      suppliers: this.supplierService.findAll(),
      products: this.productService.findAll()
    }).subscribe({
      next: ({ suppliers, products }) => {
        this.suppliers = suppliers;
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = extractErrorMessage(error);
        this.loading = false;
      }
    });
  }

  private buildItem() {
    return this.fb.nonNullable.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  addItem(): void {
    this.items.push(this.buildItem());
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = null;

    const value = this.form.getRawValue();

    this.orderService
      .create({
        supplierId: value.supplierId,
        items: value.items.map((item) => ({
          productId: item.productId,
          quantity: Number(item.quantity)
        }))
      })
      .subscribe({
        next: () => this.router.navigate(['/orders']),
        error: (error) => {
          this.errorMessage = extractErrorMessage(error);
          this.submitting = false;
        }
      });
  }
}
