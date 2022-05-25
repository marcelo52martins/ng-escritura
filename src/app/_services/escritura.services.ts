import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { ListaCfopComponent } from "../cfop/lista-cfop.component";
import { CFOP } from "../_models/cfop.model";
import { Classificacao } from "../_models/classificacao.model";
import { ClassificacaoSaida } from "../_models/classificacaoSaida.model";
import { Entrada } from "../_models/entrada.model";
import { LancamentoCfop } from "../_models/lancamento-cfop.model";
import { Saida } from "../_models/saida.model";

@Injectable({ providedIn: 'root' })
export class EscrituraServices {

    constructor(private http: HttpClient) {

    }

    listaCfop() {
        return this.http.get<CFOP[]>(`${environment.api}/escrituracao/cfop`)
    }

    listaEntradas() {
        return this.http.get<Entrada[]>(`${environment.api}/escrituracao/entradas`)
    }

    listaSaidas() {
        return this.http.get<Saida[]>(`${environment.api}/saidas`)
    }

    classificar(classificacao: Classificacao) {
        return this.http.post<LancamentoCfop>(`${environment.api}/escrituracao/entradas/classificar`, classificacao);
    }

    classificarSaida(classificacao: ClassificacaoSaida) {
        return this.http.post<LancamentoCfop>(`${environment.api}/saidas/classificar`, classificacao);
    }

    gerarLctoCfop() {
        return this.http.post(`${environment.api}/escrituracao/gerar-lancamentos-cfop`, { dataInicial: '2020-01-01', dataFinal: '2020-08-31', referencia: '2020-08-31' })
    }

    excluirLctoCfop(id: string) {
        return this.http.delete(`${environment.api}/escrituracao/lancamento-cfop/${id}`)
    }

    relatorioGia(referencia: Date) {
        return this.http.post<{ relatorio: string }>(`${environment.api}/escrituracao/relatorio-gia`, { referencia: referencia })
    }

    uploadSaidas(formData: any){
       return this.http.post<Saida[]>(`${environment.api}/saidas/upload`,formData, {reportProgress: false, observe: 'body'})
    }   

    uploadEntradas(formData: any){
        return this.http.post<Entrada[]>(`${environment.api}/escrituracao/upload`,formData, {reportProgress: false, observe: 'body'})
     }   
}