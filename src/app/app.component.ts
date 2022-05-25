import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EscrituraServices } from './_services/escritura.services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng-escritura';

  constructor(
    private toastr: ToastrService,
    private service: EscrituraServices){

  }
  gerarLancamentoCfop(){
    /*this.service.gerarLctoCfop().subscribe({next : v => {
      this.toastr.success("lançamento gerado com sucesso")

    },error: er => {
      this.toastr.error("erro ao gerar lançamento");
    }})*/
  }
}
