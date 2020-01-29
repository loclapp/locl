import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { loadTranslations } from '@angular/localize';
import { RouterModule, Routes } from '@angular/router';
import { translations } from '../../assets/i18n/lazy.fr.json';
import { LazyLoadedComponent } from './lazy-loaded.component';

loadTranslations(translations);

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
