export interface Saida {
    id:string;
    dataEmissao: Date;
    chave: string;
    valorProduto: number;
    icms: number;
    desconto: number;
    outrosValores: number;
    detalhe: any[];
    lancamentosCFOPs: any[];
}