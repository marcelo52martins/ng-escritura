export interface Classificacao{
    id:string;
    comCredito:boolean;
    outras: boolean;
    descontoCondicional:boolean;
    CFOPEntradaId: string;
    dataReferencia: {referencia: Date}
}