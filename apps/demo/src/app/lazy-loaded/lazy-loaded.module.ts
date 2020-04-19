import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LazyLoadedComponent } from './lazy-loaded.component';

const lazyRoutes: Routes = [
  {
    path: '',
    component: LazyLoadedComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(lazyRoutes)],
  declarations: [LazyLoadedComponent]
})
export class LazyLoadedModule {}
