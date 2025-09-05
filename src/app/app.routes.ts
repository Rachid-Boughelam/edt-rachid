import { Routes } from '@angular/router';
import { PlanningComponent } from './planning/planning';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'planning' },
  { path: 'planning', component: PlanningComponent },
  { path: '**', redirectTo: 'planning' },
];
