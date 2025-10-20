import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// AppRoutingModule import removed because './app-routing.module' was not found; add a routing module later if needed.
import { App } from './app';
import { AppRoutingModule } from './app-routing-module';

// Importações necessárias para comunicação e formulários:
import { HttpClientModule } from '@angular/common/http'; // Para comunicação com o backend REST [1]
import { FormsModule } from '@angular/forms'; // Para formulários de inclusão/alteração [3]

// Importações dos Componentes CRUD gerados:
import { ServicoListComponent } from './servico-list.component/servico-list.component';
import { ServicoCreateComponent } from './servico-create.component/servico-create.component';
import { ServicoUpdateComponent } from './servico-update.component/servico-update.component';
import { ServicoDetailComponent } from './servico-detail.component/servico-detail.component';



@NgModule({
  declarations: [
    App,
    ServicoListComponent,
    ServicoCreateComponent,
    ServicoUpdateComponent,
    ServicoDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // AppRoutingModule removed because './app-routing.module' was not found; add a routing module later if needed.
    // Adicionar os módulos de funcionalidade aqui:
    HttpClientModule, // Permite chamadas REST [1]
    FormsModule       // Permite formulários bidirecionais [3]
  ],
  bootstrap: [App]
})
export class AppModule { }