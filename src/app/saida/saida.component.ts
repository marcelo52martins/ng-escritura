import { animate, state, style, transition, trigger } from "@angular/animations";
import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { ToastrService } from "ngx-toastr";
import { EscolheCfopDialog } from "../_dialogs/escolhe-cfop.dialog";
import { CFOP } from "../_models/cfop.model";
import { Saida } from "../_models/saida.model";
import { EscrituraServices } from "../_services/escritura.services";

@Component({
    templateUrl: 'saida.component.html',
    styleUrls: ['saida.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class SaidaComponent {

    expandedElement!: Saida | null;
    dataSource = new MatTableDataSource<Saida>();
    periodo = new FormGroup({ inicio: new FormControl(), fim: new FormControl() })
    referenciaControl = new FormControl();
    columnsToDisplay = ['dataEmissao', 'chave', 'valorProduto'];
    cfops: CFOP[] = [];

    @ViewChild("fileUpload", { static: false }) fileUpload!: ElementRef;
    files = [];

    constructor(
        private toastr: ToastrService,
        private dialog: MatDialog,
        private service: EscrituraServices) {

        const periodoTxt = localStorage.getItem('periodoSaida');

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
                if (res.fim && res.fim >= res.inicio) {
                    const periodo = JSON.stringify({ inicio: res.inicio, fim: res.fim });
                    localStorage.setItem('periodoSaida', periodo)
                    this.dataSource.filter = periodo;
                }
            }
        })

        this.service.listaSaidas().subscribe({
            next: res => {
                this.dataSource.data = res;
                if (periodoTxt)
                    this.dataSource.filter = periodoTxt;
            }
        });

        service.listaCfop().subscribe(next => {
            this.cfops = next
        });
    }

    excluirLctoCfop(id: string, saidaId: string) {
        this.service.excluirLctoCfop(id).subscribe({
            next: res => {
                this.toastr.success("excluído com sucesso");
                const saida = this.dataSource.data.find(a => a.id == saidaId);

                if (saida) {
                    const lctoIndex = saida?.lancamentosCFOPs.findIndex(a => a.id == id);
                    if (lctoIndex != -1)
                        saida?.lancamentosCFOPs.splice(lctoIndex, 1);
                }

            }, error: er => {
                this.toastr.error("Erro ao excluir");
            }
        })
    }

    fileName!: string;

    onFileSelected(event: any) {

        const formData = new FormData();

        for (let index = 0; index < event.target.files.length; index++) {
            const file = event.target.files[index];
            if (file) {
                formData.append("formFile", file);
            }
        }

        this.service.uploadSaidas(formData).subscribe({
            next: res => {
                this.toastr.success(`carregado com sucesso`);
                this.dataSource.data.unshift(...res);
                this.dataSource.filter = localStorage.getItem('periodoSaida') || '';

            }, error: er => {
                if (er.error.message)
                    this.toastr.error(`${er.error.message}`)
                else
                    this.toastr.error("erro ao carregar");
            }
        })

        /*const file:File = event.target.files[0];

        if (file) {

            this.fileName = file.name;

            const formData = new FormData();

            formData.append("formFile", file);

            

            this.service.uploadSaidas(formData).subscribe({next : n => {
                this.toastr.success("carregado com sucesso");
            }, error: er => {
                this.toastr.error("erro ao carregar");
            }})
        }*/

    }

    classificar(saidaId: string, detalheId: string) {

        const ref = this.dialog.open(EscolheCfopDialog, {
            width: '450px',
            data: { allCFOPs: this.cfops }
        })

        ref.afterClosed().subscribe({
            next: res => {
                if (res) {

                    const cfopPreferidoJson = localStorage.getItem('cfopPreferido');

                    if (cfopPreferidoJson) {
                        const cfopPreferido = JSON.parse(cfopPreferidoJson) as string[];
                        const cfopPref = cfopPreferido.find(a => a == res)
                        if (!cfopPref) {
                            cfopPreferido.push(res);
                            localStorage.setItem('cfopPreferido', JSON.stringify(cfopPreferido))
                        }
                    } else {
                        localStorage.setItem('cfopPreferido', JSON.stringify([res]))
                    }

                    this.service.classificarSaida({ saidaId: saidaId, detalheId: detalheId, cfopId: res, dataReferencia: { referencia: this.referenciaControl.value } })
                        .subscribe({
                            next: res => {
                                this.toastr.success("incluído com sucesso");
                                const saida = this.dataSource.data.find(a => a.id == saidaId);
                                saida?.lancamentosCFOPs.push(res);

                            }, error: e => {
                                this.toastr.error("erro ao incluir");
                            }
                        })
                }
            }
        })
    }
}