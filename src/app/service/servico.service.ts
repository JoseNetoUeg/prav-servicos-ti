import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Servico } from '../model/servico.model'; // Importa a classe de modelo

@Injectable({
  providedIn: 'root'
})
export class ServicoService {
  
  // URL base relativa — permite que o dev-server (proxy.conf.json) encaminhe para o backend
  private baseURL = "/cservico/servico";
  
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
  createServico(servico: Servico): Observable<any> {
    // Ajusta a resposta do backend: alguns endpoints retornam 'codigo' em vez de 'id'.
    // Normalizamos para expor sempre 'id' no objeto retornado.
    return this.httpClient.post<any>(`${this.baseURL}`, servico).pipe(
      map(res => {
        if (res && res.codigo && !res.id) {
          res.id = res.codigo;
        }
        return res;
      })
    );
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