
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RootCertificate } from '../model/root-certificate';
import { CertificateModel } from '../model/certificateModel';
import { CertificateService } from '../service/certificate.service';
import { asLiteral } from '@angular/compiler/src/render3/view/util';

@Component({
    selector: 'app-user-certificates',
    templateUrl: './user-certificates.component.html',
    styleUrls: ['./user-certificates.component.css']
})
export class UserCertificatesComponent implements OnInit {
  certificates : CertificateModel[] = new Array();
  map = new Map<string, boolean>();

  stateChecker: FormGroup;

  constructor(private service : CertificateService) { }

  getData(){
    return  this.service.gelAllCertificatesByEmail("root@root.com").subscribe(data =>{
      this.certificates = data;
    })
  }

checkValidity(alias: string){
  this.service.isDesired(alias).subscribe(data =>{
    if(data)
      alert("Valid!");
    else
      alert("Invalid!");
  });
}

  ngOnInit(): void {
      this.stateChecker = new FormGroup({
        'dCert' : new FormControl('', [Validators.required])
      })
      this.getData();
  }

  checkCert() : string {

      //return this.service.isDesird(stateChecker.value);
      return this.stateChecker.get('dCert').value;

  }
}
