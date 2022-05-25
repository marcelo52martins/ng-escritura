import { NgModule } from "@angular/core";
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTableModule} from '@angular/material/table';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
    imports: [MatTooltipModule,MatChipsModule,MatAutocompleteModule,MatButtonModule,MatCheckboxModule,MatDatepickerModule,MatDialogModule, MatIconModule, MatIconModule, MatFormFieldModule, MatIconModule,MatInputModule,MatProgressSpinnerModule,MatSelectModule,MatSlideToggleModule,MatTableModule,MatToolbarModule], 
    exports: [MatTooltipModule,MatChipsModule,MatAutocompleteModule,MatButtonModule,MatCheckboxModule,MatDatepickerModule,MatDialogModule, MatIconModule, MatIconModule, MatFormFieldModule, MatIconModule,MatInputModule,MatProgressSpinnerModule,MatSelectModule,MatSlideToggleModule,MatTableModule,MatToolbarModule]
})
export class MaterialModule {

}