import { animate, state, style, transition, trigger } from "@angular/animations";
import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { ToastrService } from "ngx-toastr";
import { EscolheCfopDialog } from "../_dialogs/escolhe-cfop.dialog";
import { CFOP } from "../_models/cfop.model";
import { Detalhe } from "../_models/detalhe.model";
import { Entrada } from "../_models/entrada.model";
import { EscrituraServices } from "../_services/escritura.services";

@Component({
    templateUrl: 'escritura.component.html',
    styleUrls: ['escritura.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class EscrituraComponent {

    cfops: CFOP[] = [];
    dataSource = new MatTableDataSource<Entrada>();
    columnsToDisplay = ['emissao', 'chave', 'emitente'];
    expandedElement!: Entrada | null;
    @ViewChild(MatTable) table!: MatTable<any>;
    periodo: FormGroup;
    referenciaControl = new FormControl();

    constructor(private toastr: ToastrService,
        private services: EscrituraServices,
        private dialog: MatDialog
    ) {

        this.periodo = new FormGroup({
            inicio: new FormControl(), fim: new FormControl()
        });

        const periodoTxt = localStorage.getItem('periodo');

        if (periodoTxt) {
            const armazenado = JSON.parse(periodoTxt);
            if (armazenado) {
                this.periodo.patchValue(armazenado);
            }
        }

        this.dataSource.filterPredicate = (entrada, filtro) => {
            const periodo = JSON.parse(filtro);
            return entrada.dataEmissao >= periodo.inicio && entrada.dataEmissao <= periodo.fim;
        }

        this.periodo.valueChanges.subscribe({
            next: res => {
                if (res.fim && res.fim > res.inicio) {
                    const periodo = JSON.stringify({ inicio: res.inicio, fim: res.fim });
                    localStorage.setItem('periodo', periodo)
                    this.dataSource.filter = periodo;
                }
            }
        })

        services.listaCfop().subscribe(next => {
            this.cfops = next
        });

        services.listaEntradas().subscribe(next => {
            this.dataSource.data = next;
            if (periodoTxt)
                this.dataSource.filter = periodoTxt;
        })

    }

    onFileSelected(event: any) {

        const formData = new FormData();

        for (let index = 0; index < event.target.files.length; index++) {
            const file = event.target.files[index];
            if (file) {
                formData.append("formFile", file);
            }
        }

        this.services.uploadEntradas(formData).subscribe({
            next: res => {
                this.toastr.success(`carregado com sucesso`);
                this.dataSource.data.unshift(...res);
                this.dataSource.filter = localStorage.getItem('periodo') || '';

            }, error: er => {
                if (er.error.message)
                    this.toastr.error(`${er.error.message}`)
                else
                    this.toastr.error("erro ao carregar");
            }
        })

        

    }

    classificar(detalhe: Detalhe) {
        const ref = this.dialog.open(EscolheCfopDialog, {
            width: '450px',
            data: { allCFOPs: this.cfops }
        })

        ref.afterClosed().subscribe(next => {
            if (next) {
                detalhe.cfopEntradaId = next;

                const cfopPreferidoJson = localStorage.getItem('cfopPreferido');

                if (cfopPreferidoJson) {
                    const cfopPreferido = JSON.parse(cfopPreferidoJson) as string[];
                    const cfopPref = cfopPreferido.find(a => a == detalhe.cfopEntradaId)
                    if (!cfopPref) {
                        cfopPreferido.push(detalhe.cfopEntradaId);
                        localStorage.setItem('cfopPreferido', JSON.stringify(cfopPreferido))
                    }
                } else {
                    localStorage.setItem('cfopPreferido', JSON.stringify([detalhe.cfopEntradaId]))
                }

                this.salvar(detalhe);
            }
        })
    }
    getDescrCfopById(id: string): string {
        return this.cfops.find(a => a.id == id)?.descr || ' ';
    }
    getCodigoCfopById(id: string) {
        return this.cfops.find(a => a.id == id)?.codigo
    }

    excluirLctoCfop(id: string, entradaId: string) {
        this.services.excluirLctoCfop(id).subscribe({
            next: res => {
                this.toastr.success("excluído com sucesso");
                const entrada = this.dataSource.data.find(a => a.id == entradaId);

                if (entrada) {
                    const lctoIndex = entrada?.lancamentosCFOPs.findIndex(a => a.id == id);
                    if (lctoIndex != -1)
                        entrada?.lancamentosCFOPs.splice(lctoIndex, 1);
                    //this.table.renderRows();
                }

            }, error: er => {
                this.toastr.error("Erro ao excluir");
            }
        })
    }

    salvar(detalhe: Detalhe) {

        this.services.classificar({ id: detalhe.id, comCredito: detalhe.comCredito, outras: detalhe.outras, descontoCondicional: detalhe.descontoCondicional, CFOPEntradaId: detalhe.cfopEntradaId, dataReferencia: { referencia: this.referenciaControl.value } }).subscribe({
            next: res => {
                this.toastr.success("gravado com sucesso");
                const entrada = this.dataSource.data.find(a => a.id == detalhe.entradaId);
                /*const anterior = entrada?.lancamentosCFOPs.findIndex(a => a.cfop == res.cfop) || -1;

                if (anterior != -1) {
                    entrada?.lancamentosCFOPs.splice(anterior, 1);
                }*/

                entrada?.lancamentosCFOPs.push(res);

            }, error: er => {
                this.toastr.error("erro ao gravar");
            }
        })
    }
}