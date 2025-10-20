export class Servico {
  codigo!: number;           // O backend usa Long, que corresponde a number no TypeScript [1, 2]
  tipoServico!: string;
  descricaoDetalhada!: string;
  dataExecucao!: Date;       // O backend usa java.sql.Date [2]
  valor!: number;            // No TypeScript, number é usado tanto para inteiros (Long no Java) quanto para números de ponto flutuante (double no Java) [2]
  disponivel!: boolean;
}