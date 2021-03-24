
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RootCertificate } from '../model/root-certificate';
import { CertificateModel } from '../model/certificateModel';
import { CertificateService } from '../service/certificate.service';

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
    return  this.service.gelAllCertificates().subscribe(data =>{
      this.certificates = data;
    })
  }

 getDesiredData(){
    return  this.service.gelAllCertificates().subscribe(data =>{
      this.certificates = data;
      this.findDesiredCert();
    })
  }

 findDesiredCert(){
   for(let i = 0; i < this.certificates.length; i++){
    if(this.certificates[i].serialNum == this.checkCert()){
         this.service.isDesired(this.certificates[i].serialNum).subscribe(data =>{
           this.map.set(this.certificates[i].serialNum, data);
         });
    }
   }
   console.log(this.map)
}


  ngOnInit(): void {
      this.stateChecker = new FormGroup({
        'dCert' : new FormControl('', [Validators.required])
      })
      this.getDesiredData();
  }

  checkCert() : string {

      //return this.service.isDesird(stateChecker.value);
      return this.stateChecker.get('dCert').value;

  }
}
