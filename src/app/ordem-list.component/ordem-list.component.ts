import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Ordem } from '../model/ordem.model';
import { OrdemService } from '../service/ordem.service';

@Component({
  selector: 'app-ordem-list',
  standalone: false,
  templateUrl: './ordem-list.component.html',
  styleUrls: []
})
export class OrdemListComponent implements OnInit {
  ordens: Ordem[] = [];

  constructor(private ordemService: OrdemService, private router: Router) {}

  ngOnInit(): void {
    this.getOrdens();
  }

  getOrdens(): void {
    this.ordemService.getOrdensList().subscribe(data => this.ordens = data || []);
  }

  viewDetails(id?: number): void {
    if (!id) return;
    this.router.navigate(['/ordens', id]);
  }

  editOrdem(id?: number): void {
    if (!id) return;
    this.router.navigate(['/ordens/edit', id]);
  }

  deleteOrdem(id?: number): void {
    if (!id) return;
    if (!confirm('Confirma exclusão desta ordem?')) return;
    this.ordemService.deleteOrdem(id).subscribe(() => this.getOrdens());
  }

  createNew(): void {
    this.router.navigate(['/ordens/create']);
  }
}
