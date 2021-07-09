import { Component, OnInit } from '@angular/core';
import { AllVerificationRequests } from '../model/allVerificationRequests';
import { UpdateVerificationRequestStatus } from '../model/updateVerificationRequestStatus';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-verification-requests',
  templateUrl: './verification-requests.component.html',
  styleUrls: ['./verification-requests.component.css']
})
export class VerificationRequestsComponent implements OnInit {

  verificationRequests: AllVerificationRequests[] = new Array();

  constructor(private adminService : AdminService) { }

  ngOnInit(): void {
    this.loadAllRequests();
  }

  loadAllRequests() {
    this.adminService.getAllVerificationRequests().subscribe(data => {
      this.verificationRequests = data;
    });
  }

  updateStatus(requestId, requestStatus, element) {
    this.adminService.updateVerificationRequestStatus(new UpdateVerificationRequestStatus(requestId, requestStatus)).subscribe(data => {
      this.loadAllRequests();
    });
  }

}
