import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// CORREÇÃO: Usando a pasta 'servico-list.component' se essa for a estrutura real
import { ServicoListComponent } from './servico-list.component/servico-list.component'; 
import { ServicoCreateComponent } from './servico-create.component/servico-create.component'; 
import { ServicoUpdateComponent } from './servico-update.component/servico-update.component'; 
import { ServicoDetailComponent } from './servico-detail.component/servico-detail.component'; 
import { LoginComponent } from './login.component/login.component';
import { RegisterComponent } from './register.component/register.component';
import { OrdemListComponent } from './ordem-list.component/ordem-list.component';
import { OrdemDetailComponent } from './ordem-detail.component/ordem-detail.component';

const routes: Routes = [
  // Rotas que mapeiam os caminhos para os componentes
  { path: 'servicos', component: ServicoListComponent }, // Rota para Listar
  { path: 'servicos/create', component: ServicoCreateComponent }, // Rota para Incluir
  { path: 'servicos/update/:id', component: ServicoUpdateComponent }, // Rota para Alterar [1]
  { path: 'servicos/details/:id', component: ServicoDetailComponent }, // Rota para Consultar [1]
  { path: 'ordens', component: OrdemListComponent },
  { path: 'ordens/create', component: OrdemDetailComponent },
  { path: 'ordens/edit/:id', component: OrdemDetailComponent },
  { path: 'ordens/:id', component: OrdemDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'servicos', pathMatch: 'full' } // Rota padrão [1]
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }