import { Component, OnInit } from '@angular/core';
import { CertificateModel } from '../model/certificateModel';
import { CertificateService } from '../services/certificate.service';

@Component({
  selector: 'app-certificate-list',
  templateUrl: './certificate-list.component.html',
  styleUrls: ['./certificate-list.component.css']
})
export class CertificateListComponent implements OnInit {
  certificates : CertificateModel[] = new Array();
  map = new Map<string, boolean>();

  constructor(private service : CertificateService) { }

  getData(){
    return  this.service.gelAllCertificates().subscribe(data =>{
      this.certificates = data;
      this.findRevokedCerts();
    })
  }
  revoke(serialNum: string){
    this.service.revokeCertificate(serialNum).subscribe(data =>{
      if(data == "Sertifikat je povucen."){
        this.findRevokedCerts();
      }
    })
  }
  findRevokedCerts(){
    for(let i = 0; i < this.certificates.length; i++){
      this.service.isRevoked(this.certificates[i].serialNum).subscribe(data =>{
        this.map.set(this.certificates[i].serialNum, data);
      });
    }
    console.log(this.map)
  }

  ngOnInit(): void {
      this.getData();
  }
}
