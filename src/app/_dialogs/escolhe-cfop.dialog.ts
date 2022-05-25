import { A, B, COMMA, ENTER } from '@angular/cdk/keycodes';
import { ThisReceiver } from '@angular/compiler';
import { Component, ElementRef, Inject, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipSelectionChange } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { map, Observable, startWith } from "rxjs";
import { CFOP } from "../_models/cfop.model";

@Component({
    templateUrl: 'escolhe-cfop.dialog.html',
    styleUrls: ['escolhe-cfop.dialog.css']
})
export class EscolheCfopDialog {
    separatorKeysCodes: number[] = [ENTER, COMMA];
    cfopCtrl = new FormControl();
    filteredCFOPs!: Observable<CFOP[]>;
    cfops: CFOP[] = [];
    cfopSelecionado!: CFOP

    @ViewChild('cfopInput') cfopInput!: ElementRef<HTMLInputElement>;

    constructor(public dialogRef: MatDialogRef<EscolheCfopDialog>, @Inject(MAT_DIALOG_DATA) public data: { allCFOPs: CFOP[] }) {

        this.filteredCFOPs = this.cfopCtrl.valueChanges.pipe(
            startWith(null),
            map((cfop: string | null) => (cfop ? this._filter(cfop) : this.data.allCFOPs.slice())),
        );

        const cfopsPreferidosJson = localStorage.getItem('cfopPreferido');

        if(cfopsPreferidosJson){
            const cfopsPreferidos = JSON.parse(cfopsPreferidosJson) as string[];
            this.cfops = this.data.allCFOPs.filter(a => cfopsPreferidos.findIndex(b => b == a.id ) != -1)
        }

    }

    add(event: MatChipInputEvent): void {
        const value = this.data.allCFOPs.find(a => {
            a.id == event.value
        })

        if (value) {
            this.cfops.push(value);
        }

        event.chipInput!.clear();

        this.cfopCtrl.setValue(null);
    }

    remove(cfop: CFOP): void {
        const index = this.cfops.indexOf(cfop);

        if (index >= 0) {
            this.cfops.splice(index, 1);
        }
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        const cfop = this.data.allCFOPs.find((a, b, c) => {
            return a.codigo === (event.option.value as string)
        })!;
        this.cfops.push(cfop);
        this.cfopInput.nativeElement.value = '';
        this.cfopCtrl.setValue(null);
    }

    compareWithCFOP(a: CFOP, b: CFOP) {
        console.log(`A: ${JSON.stringify(a)} B:${JSON.stringify(b)}`)
        return true;
    }

    private _filter(value: string): CFOP[] {
        const filterValue = value.toLowerCase();
        return this.data.allCFOPs.filter(fruit => fruit.codigo.replace('.', '').includes(filterValue.replace('.', '')) || fruit.descr.toLowerCase().includes(filterValue));
    }

    close() {
        this.dialogRef.close(this.cfopSelecionado)
    }

    
}