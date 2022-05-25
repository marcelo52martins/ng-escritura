import { Detalhe } from "./detalhe.model";
import { LancamentoCfop } from "./lancamento-cfop.model";

export interface Entrada{
    id:string;
    chave:string;
    dataEmissao:Date;
    emitente:string;
    simplesNacional:boolean;
    baseICMS: number;
    desconto: number;
    despesasAcessorias: number;
    icmsst:number;
    ipi: number;
    valorICMS: number;
    valorTotalNf: number;
    detalhes: Detalhe[];
    lancamentosCFOPs: LancamentoCfop[];
}