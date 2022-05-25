import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MaterialModule } from './material.module';
import { EscrituraComponent } from './escritura/escritura.component';
import '@angular/common/locales/global/pt';
import { EscolheCfopDialog } from './_dialogs/escolhe-cfop.dialog';

import { ToastrModule } from 'ngx-toastr';
import { ListaCfopComponent } from './cfop/lista-cfop.component';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { GiaComponent } from './gia/gia.component';
import { SaidaComponent } from './saida/saida.component';

@NgModule({
  declarations: [
    AppComponent, EscrituraComponent, EscolheCfopDialog, ListaCfopComponent, GiaComponent,SaidaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    MatNativeDateModule,
    ToastrModule.forRoot()
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'pt' }, { provide: MAT_DATE_LOCALE, useValue: 'pt' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
