import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servico } from '../model/servico.model'; // Importa a classe de modelo

@Injectable({
  providedIn: 'root'
})
export class ServicoService {
  
  // URL base, assumindo o mapeamento do Spring Boot
  private baseURL = "http://localhost:8080/cservico/servico"; 
  
  // Injeção de dependência do HttpClient
  constructor(private httpClient: HttpClient) { }
  
  // 1. LISTAR (Read - All)
  getServicosList(): Observable<Servico[]> {
    return this.httpClient.get<Servico[]>(`${this.baseURL}`);
  }
  
  // 2. CONSULTAR (Read - One)
  getServicoById(id: number): Observable<Servico> {
    return this.httpClient.get<Servico>(`${this.baseURL}/${id}`);
  }

  // 3. INCLUIR (Create)
  createServico(servico: Servico): Observable<Object> {
    return this.httpClient.post(`${this.baseURL}`, servico);
  }
  
  // 4. ALTERAR (Update)
  updateServico(id: number, servico: Servico): Observable<Object> {
    return this.httpClient.put(`${this.baseURL}/${id}`, servico);
  }
  
  // 5. EXCLUIR (Delete)
  deleteServico(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseURL}/${id}`);
  }
}