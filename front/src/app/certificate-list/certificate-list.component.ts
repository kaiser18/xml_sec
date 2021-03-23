import { Component, OnInit } from '@angular/core';
import { CertificateModel } from '../model/certificateModel';
import { CertificateService } from '../service/certificate.service';

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
    })
  }
  revoke(serialNum: string){
    this.service.revokeCertificate(serialNum).subscribe(data =>{
      if(data == "Sertifikat je povucen."){
        
      }
    })
  }

  ngOnInit(): void {
      this.getData();
  }
}
