import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Servico } from '../model/servico.model';
import { ServicoService } from '../service/servico.service';

@Component({
  selector: 'app-servico-update',
  standalone: false,
  templateUrl: './servico-update.component.html',
  styleUrls: ['./servico-update.component.css']
})
export class ServicoUpdateComponent implements OnInit {
  servico: Servico = new Servico();
  id?: number;

  constructor(private route: ActivatedRoute, private servicoService: ServicoService, private router: Router) { }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.servicoService.getServicoById(this.id).subscribe(data => this.servico = data);
    }
  }

  save(): void {
    if (!this.id) return;
    this.servicoService.updateServico(this.id, this.servico).subscribe(() => this.router.navigate(['/servicos']));
  }

  cancel(): void {
    this.router.navigate(['/servicos']);
  }
}
// duplicate stub removed
