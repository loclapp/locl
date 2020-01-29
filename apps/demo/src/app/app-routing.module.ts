import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'lazy',
    loadChildren: () =>
      import('./lazy-loaded/lazy-loaded.module').then(
        mod => mod.LazyLoadedModule
      )
    // If you don't want to bundle the translations in the lazy loaded module
    // you can also do:
    // loadChildren: () => getTranslations('/assets/i18n/lazy.fr.json').then(
    //   (data: ParsedTranslationBundle) => {
    //     loadTranslations(data.translations);
    //     return import('./lazy-loaded/lazy-loaded.module')
    //       .then(mod => mod.LazyLoadedModule);
    //   }
    // )
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
