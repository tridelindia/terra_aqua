import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ToastrModule } from 'ngx-toastr';
import { CurrentUser } from '../../model/config.model';
import { ConfigDataService } from '../config-data.service';
import { response } from 'express';
import { error } from 'console';
interface ApiKey{
  api_key:string
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, RouterModule, ToastrModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ConfigDataService, ToastrModule],
})
export class LoginComponent implements OnInit {
  userName: string = '';
  password: string = '';
  apiKey!:string;
  currentUser!: CurrentUser;
  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastrService,
    private config: ConfigDataService
  ) {}
  ngOnInit(): void {
    localStorage.removeItem('loginTime');
    //un Comment for production /////**************** */ ********
    this.getKey().then((isActive) => {
      if (!isActive) {
        //console.log(true);
        // this.router.navigate(['/login']);
      } else {
        //console.log(false);
        this.router.navigate(['/installation'])
      }
    });
  }
  login(event: Event) {
    event.preventDefault(); // Prevent the default form submission

    const user = {
      userName: this.userName,
      password: this.password,
    };

    this.config.login(user).subscribe(
      (response) => {
        this.currentUser = response;
        this.config.CurrentUser = this.currentUser;
        localStorage.setItem('loginTime', Date.now().toString());
        localStorage.setItem('username', this.currentUser.name);
        this.router.navigate(['/base/home']);
        this.toast.success('Logged in Succesfully', 'Access Granted ');
      },
      (error) => {
        this.toast.error('Invalid Credentials', 'Access Denied ');
      }
    );

  }


  getKey(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:3000/api/users/getKey').subscribe(
        (response: any) => {
          const key: ApiKey = response;
          this.apiKey = key.api_key;
          //console.log(key.api_key);
          resolve(true); // Resolve the promise when key is found
        },
        (error) => {
          //console.error(error);
          resolve(false); // Resolve the promise with false in case of error
        }
      );
    });
  }
}
