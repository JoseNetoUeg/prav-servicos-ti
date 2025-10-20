import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Servico } from '../model/servico.model';
import { ServicoService } from '../service/servico.service';

@Component({
  selector: 'app-servico-detail',
  standalone: false,
  templateUrl: './servico-detail.component.html',
  styleUrls: ['./servico-detail.component.css']
})
export class ServicoDetailComponent implements OnInit {
  servico: Servico | null = null;
  id?: number;

  constructor(private route: ActivatedRoute, private servicoService: ServicoService, private router: Router) { }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.servicoService.getServicoById(this.id).subscribe(data => this.servico = data);
    }
  }

  back(): void {
    this.router.navigate(['/servicos']);
  }
}
// duplicate stub removed
