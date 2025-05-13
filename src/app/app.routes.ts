import { Route, Routes } from '@angular/router';

import { adminLayoutRoutes } from './layouts/admin/admin.layout.routes';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'admin', pathMatch: 'full' },
  { path: 'admin', children: adminLayoutRoutes },
  { path: '**', component: NotFoundComponent }
];