import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VerifyAccountService } from '../service/verify-account.service';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.css']
})
export class VerifyAccountComponent implements OnInit {

  private token: string;

  constructor(private service: VerifyAccountService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'];
  }

  verify() {
    this.service.verify(this.token).subscribe(result =>{
      this.router.navigate(['/logIn']);
    })
  }
}
