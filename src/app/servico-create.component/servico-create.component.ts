import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Servico } from '../model/servico.model';
import { ServicoService } from '../service/servico.service';

@Component({
  selector: 'app-servico-create',
  standalone: false,
  templateUrl: './servico-create.component.html',
  styleUrls: ['./servico-create.component.css']
})
export class ServicoCreateComponent {
  servico: Servico = new Servico();

  constructor(private servicoService: ServicoService, private router: Router) { }

  save(): void {
    this.servicoService.createServico(this.servico).subscribe(() => this.router.navigate(['/servicos']));
  }

  cancel(): void {
    this.router.navigate(['/servicos']);
  }
}
// duplicate stub removed
