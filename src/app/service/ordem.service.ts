import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ordem } from '../model/ordem.model';

@Injectable({ providedIn: 'root' })
export class OrdemService {
  // Ajuste a baseURL conforme a sua API (ex: '/cordem/ordem' ou '/ordem')
  private baseURL = '/cordem/ordem';

  constructor(private http: HttpClient) {}

  getOrdensList(): Observable<Ordem[]> {
    return this.http.get<Ordem[]>(`${this.baseURL}`);
  }

  getOrdemById(id: number): Observable<Ordem> {
    return this.http.get<Ordem>(`${this.baseURL}/${id}`);
  }

  createOrdem(ordem: Ordem): Observable<any> {
    return this.http.post(`${this.baseURL}`, ordem);
  }

  updateOrdem(id: number, ordem: Ordem): Observable<any> {
    return this.http.put(`${this.baseURL}/${id}`, ordem);
  }

  deleteOrdem(id: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/${id}`);
  }
}
