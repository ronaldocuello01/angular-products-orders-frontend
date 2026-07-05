import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'orders', pathMatch: 'full' },
  {
    path: 'orders',
    loadComponent: () =>
      import('./features/orders/order-list/order-list.component').then(
        (m) => m.OrderListComponent
      )
  },
  {
    path: 'orders/new',
    loadComponent: () =>
      import('./features/orders/order-create/order-create.component').then(
        (m) => m.OrderCreateComponent
      )
  },
  {
    path: 'stock',
    loadComponent: () =>
      import('./features/stock/stock-list/stock-list.component').then(
        (m) => m.StockListComponent
      )
  },
  {
    path: 'alerts',
    loadComponent: () =>
      import('./features/alerts/alert-list/alert-list.component').then(
        (m) => m.AlertListComponent
      )
  },
  { path: '**', redirectTo: 'orders' }
];
