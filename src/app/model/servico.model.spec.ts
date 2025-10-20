export class Servico {
  codigo!: number; // O backend usa Long, que corresponde a number no TypeScript [11, 12]
  tipoServico!: string; 
  descricaoDetalhada!: string;
  dataExecucao!: Date; // O backend usa java.sql.Date [2]
  valor!: number; 
  disponivel!: boolean;
}