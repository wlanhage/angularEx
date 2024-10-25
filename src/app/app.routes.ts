import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { TestpageComponent } from './views/testpage/testpage.component';
import { CompareComponent } from './views/compare/compare.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'testpage', component: TestpageComponent },
  { path: 'compare', component: CompareComponent }
];
