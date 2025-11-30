import { Servico } from './servico.model';

export class OrdemItem {
  id?: number;
  ordemId?: number;
  servico?: Servico | null;
  linhaNum?: number;
  descricao?: string;
  quantidade?: number;
  precoUnitario?: number;
  subtotal?: number;
}
