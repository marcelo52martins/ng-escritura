import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { EscrituraServices } from "../_services/escritura.services";

@Component({
    templateUrl: 'gia.component.html',
    styleUrls: ['gia.component.css']
})
export class GiaComponent {

    referenciaControl = new FormControl();
    relatorio = ''

    constructor(private service:EscrituraServices) {

    }

    gerarRelatorio(){
        this.service.relatorioGia(this.referenciaControl.value).subscribe({next : res => {
            console.log(`retorno relatório: ${res.relatorio}`)
            this.relatorio = res.relatorio;
        }})
    }
}