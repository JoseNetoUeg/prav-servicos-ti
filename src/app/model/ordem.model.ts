import { OrdemItem } from './ordem-item.model';

export class Ordem {
  id?: number;
  referencia?: string;
  clienteId?: number;
  dataCriacao?: Date;
  status?: string;
  total?: number;
  itens?: OrdemItem[];
}
