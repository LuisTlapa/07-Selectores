import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectorPageComponent } from './paises/pages/selector-page/selector-page.component';

const routes: Routes = [
  {
    path: 'selector',
    loadChildren: () => import('./paises/paises.module').then( m => m.PaisesModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
