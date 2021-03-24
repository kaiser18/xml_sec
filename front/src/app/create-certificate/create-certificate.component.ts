import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OtherCertificate } from '../model/other-certificate';
import { RootCertificate } from '../model/root-certificate';
import { CertificateService } from '../service/certificate.service';

@Component({
  selector: 'app-create-certificate',
  templateUrl: './create-certificate.component.html',
  styleUrls: ['./create-certificate.component.css']
})
export class CreateCertificateComponent implements OnInit {

  rootForm: FormGroup;
  otherForm: FormGroup;
  rootCertificate: RootCertificate;
  otherCertificate: OtherCertificate;

  commonName: string;
  alias: string;
  orgName: string;
  orgUnit: string;
  country: string;
  email: string;
  serialNum: string;
  validity: string;
  purpose: string;

  issuerAlias: string;
  isCA: boolean;

  constructor(private service : CertificateService) { }

  ngOnInit(): void {
    this.rootForm = new FormGroup({
      'commonName': new FormControl('', [Validators.required]),
      'alias': new FormControl('', [Validators.required]),
      'orgName': new FormControl('', [Validators.required]),
      'orgUnit': new FormControl('', [Validators.required]),
      'country': new FormControl('', [Validators.required]),
      'email': new FormControl('', [Validators.required]),
      'serialNum': new FormControl('', [Validators.required]),
      'validity': new FormControl('', [Validators.required]),
      'purpose': new FormControl('', [Validators.required])
    })

    this.otherForm = new FormGroup({
      'issuerAlias': new FormControl('', [Validators.required]),
      'commonName': new FormControl('', [Validators.required]),
      'alias': new FormControl('', [Validators.required]),
      'orgName': new FormControl('', [Validators.required]),
      'orgUnit': new FormControl('', [Validators.required]),
      'country': new FormControl('', [Validators.required]),
      'email': new FormControl('', [Validators.required]),
      'serialNum': new FormControl('', [Validators.required]),
      'validity': new FormControl('', [Validators.required]),
      'purpose': new FormControl('', [Validators.required]),
      'isCA': new FormControl('yes', [Validators.required])
    })
  }
  
  public createRoot() {
    this.commonName = this.rootForm.value.commonName;
    this.alias = this.rootForm.value.alias;
    this.orgName = this.rootForm.value.orgName;
    this.orgUnit = this.rootForm.value.orgUnit;
    this.country = this.rootForm.value.country;
    this.email = this.rootForm.value.email;
    this.serialNum = this.rootForm.value.serialNum;
    this.validity = this.rootForm.value.validity;
    this.purpose = this.rootForm.value.purpose;

    this.rootCertificate = new RootCertificate(this.commonName, this.alias, this.orgName, this.orgUnit, this.country, this.email, this.serialNum,
      this.validity, this.purpose)

    this.service.createRootCertificate(this.rootCertificate).subscribe(
      res => {
        this.rootForm.reset();
        alert("success");
      },
      error => {
        alert("error");
      }
      
    )
  }

  public createOther() {
    this.issuerAlias = this.otherForm.value.issuerAlias;
    this.commonName = this.otherForm.value.commonName;
    this.alias = this.otherForm.value.alias;
    this.orgName = this.otherForm.value.orgName;
    this.orgUnit = this.otherForm.value.orgUnit;
    this.country = this.otherForm.value.country;
    this.email = this.otherForm.value.email;
    this.serialNum = this.otherForm.value.serialNum;
    this.validity = this.otherForm.value.validity;
    this.purpose = this.otherForm.value.purpose;
    this.isCA = this.CACheck();

    this.otherCertificate = new OtherCertificate(this.issuerAlias, this.commonName, this.alias, this.orgName, this.orgUnit, this.country, this.email, this.serialNum,
      this.validity, this.purpose, this.isCA)

      this.service.createOtherCertificate(this.otherCertificate).subscribe(
        res => {
          this.otherForm.reset();
          alert("success");
        },
        error => {
          alert("error");
        }
      )
  }

  private CACheck() : boolean {
    const radios = this.otherForm.value.isCA;
    if (radios == "yes") {
      return true;
    }
    return false;
  }

}
