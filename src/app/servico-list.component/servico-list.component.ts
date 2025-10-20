import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Servico } from '../model/servico.model';
import { ServicoService } from '../service/servico.service';

@Component({
  selector: 'app-servico-list',
  standalone: false,
  templateUrl: './servico-list.component.html',
  styleUrls: ['./servico-list.component.css']
})
export class ServicoListComponent implements OnInit {
  servicos: Servico[] = [];

  constructor(private servicoService: ServicoService, private router: Router) { }

  ngOnInit(): void {
    this.getServicos();
  }

  getServicos(): void {
    this.servicoService.getServicosList().subscribe(data => {
      this.servicos = data;
    });
  }

  deleteServico(id?: number): void {
    if (!id) return;
    if (!confirm('Confirma exclusão deste serviço?')) return;
    this.servicoService.deleteServico(id).subscribe(() => this.getServicos());
  }

  viewDetails(id?: number): void {
    if (!id) return;
    this.router.navigate(['/servicos/details', id]);
  }

  editServico(id?: number): void {
    if (!id) return;
    this.router.navigate(['/servicos/update', id]);
  }

  createNew(): void {
    this.router.navigate(['/servicos/create']);
  }
}
