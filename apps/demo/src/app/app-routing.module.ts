import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { getTranslations, ParsedTranslationBundle } from '@locl/core';

const routes: Routes = [
  {
    path: 'lazy',
    loadChildren: () =>
      getTranslations('/assets/i18n/lazy.fr.json').then(
        (data: ParsedTranslationBundle) => {
          return import('./lazy-loaded/lazy-loaded.module').then(
            mod => mod.LazyLoadedModule
          );
        }
      )
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
