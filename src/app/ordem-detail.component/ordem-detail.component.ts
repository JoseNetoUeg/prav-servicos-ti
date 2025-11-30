import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ordem } from '../model/ordem.model';
import { OrdemService } from '../service/ordem.service';
import { Servico } from '../model/servico.model';
import { ServicoService } from '../service/servico.service';

@Component({
  selector: 'app-ordem-detail',
  standalone: false,
  templateUrl: './ordem-detail.component.html',
  styleUrls: []
})
export class OrdemDetailComponent implements OnInit {
  ordem: Ordem = { itens: [] };
  servicos: Servico[] = [];
  id?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordemService: OrdemService,
    private servicoService: ServicoService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadServicos();
    if (this.id) {
      this.ordemService.getOrdemById(this.id).subscribe(o => this.ordem = o || { itens: [] });
    }
  }

  loadServicos(): void {
    this.servicoService.getServicosList().subscribe(s => this.servicos = s || []);
  }

  addItem(): void {
    const it: any = { linhaNum: (this.ordem.itens?.length || 0) + 1, quantidade: 1, precoUnitario: 0, subtotal: 0 };
    this.ordem.itens = this.ordem.itens || [];
    this.ordem.itens.push(it);
  }

  removeItem(index: number): void {
    if (!this.ordem.itens) return;
    this.ordem.itens.splice(index,1);
  }

  recalcItem(it: any): void {
    const q = Number(it.quantidade) || 0;
    const p = Number(it.precoUnitario) || 0;
    it.subtotal = q * p;
    this.recalcTotal();
  }

  recalcTotal(): void {
    this.ordem.total = (this.ordem.itens || []).reduce((acc, it) => acc + (Number(it.subtotal) || 0), 0);
  }

  save(): void {
    if (this.id) {
      this.ordemService.updateOrdem(this.id, this.ordem).subscribe(() => this.router.navigate(['/ordens']));
    } else {
      this.ordemService.createOrdem(this.ordem).subscribe(() => this.router.navigate(['/ordens']));
    }
  }

  back(): void {
    this.router.navigate(['/ordens']);
  }
}
