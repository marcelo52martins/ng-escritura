import { Component } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { CFOP } from "../_models/cfop.model";
import { EscrituraServices } from "../_services/escritura.services";

@Component({
    templateUrl: 'lista-cfop.component.html',
    styleUrls: ['lista-cfop.component.css']
})
export class ListaCfopComponent {
    dataSource = new MatTableDataSource<CFOP>();
    columnsToDisplay = ['codigo', 'descr', 'nota'];

    constructor(private service: EscrituraServices) {

        this.service.listaCfop().subscribe({next: res => {
            this.dataSource.data = res;
        }})

    }

}