import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Certificate } from '../model/certificate';
import { CertificateService } from '../service/certificate.service';

@Component({
  selector: 'app-create-certificate',
  templateUrl: './create-certificate.component.html',
  styleUrls: ['./create-certificate.component.css']
})
export class CreateCertificateComponent implements OnInit {

  postForm: FormGroup;
  certificate: Certificate;

  commonName: string;
  alias: string;
  orgName: string;
  orgUnit: string;
  country: string;
  email: string;
  serialNum: string;
  ksName: string;
  ksPassword: string;
  privateKeyPassword: string;
  validity: string;
  purpose: string;

  constructor(private service : CertificateService) { }

  ngOnInit(): void {
    this.postForm = new FormGroup({
      'commonName': new FormControl('', [Validators.required]),
      'alias': new FormControl('', [Validators.required]),
      'orgName': new FormControl('', [Validators.required]),
      'orgUnit': new FormControl('', [Validators.required]),
      'country': new FormControl('', [Validators.required]),
      'email': new FormControl('', [Validators.required]),
      'serialNum': new FormControl('', [Validators.required]),
      'ksName': new FormControl('', [Validators.required]),
      'ksPassword': new FormControl('', [Validators.required]),
      'privateKeyPassword': new FormControl('', [Validators.required]),
      'validity': new FormControl('', [Validators.required]),
      'purpose': new FormControl('', [Validators.required])
    })
  }
  
  public onSubmit() {
    this.commonName = this.postForm.value.commonName;
    this.alias = this.postForm.value.alias;
    this.orgName = this.postForm.value.orgName;
    this.orgUnit = this.postForm.value.orgUnit;
    this.country = this.postForm.value.country;
    this.email = this.postForm.value.email;
    this.serialNum = this.postForm.value.serialNum;
    this.ksName = this.postForm.value.ksName;
    this.ksPassword = this.postForm.value.ksPassword;
    this.privateKeyPassword = this.postForm.value.privateKeyPassword;
    this.validity = this.postForm.value.validity;
    this.purpose = this.postForm.value.purpose;

    this.certificate = new Certificate(this.commonName, this.alias, this.orgName, this.orgUnit, this.country, this.email, this.serialNum,
      this.ksName, this.ksPassword, this.privateKeyPassword, this.validity, this.purpose)

    
  }

}
