import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaCfopComponent } from './cfop/lista-cfop.component';
import { EscrituraComponent } from './escritura/escritura.component';
import { GiaComponent } from './gia/gia.component';
import { SaidaComponent } from './saida/saida.component';

const routes: Routes = [
  {
    path: 'entradas', component: EscrituraComponent
  }, {
    path: 'lista-cfop', component: ListaCfopComponent
  }, {
    path: 'gia', component: GiaComponent
  }, {
    path: 'saidas', component: SaidaComponent
  }, {
    path: '', component: EscrituraComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
