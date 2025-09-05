import { Routes } from '@angular/router';
import { PlanningComponent } from './planning/planning';

export const routes: Routes = [
  { path: '', component: PlanningComponent }, 
  { path: '**', redirectTo: '' }, 
];
