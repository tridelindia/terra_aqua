import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
interface ApiKey{
  api_key:string
}
@Component({
  selector: 'app-loading',
  imports: [HttpClientModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent implements OnInit{
  apiKey!:string;
  ngOnInit(): void {
    // Calling the asynchronous function and handling routing after getting the key.
    this.getKey().then((isActive) => {
      if (!isActive) {
        //console.log(true);
        this.route.navigate(['/login']);
      } else {
        //console.log(false);
        this.route.navigate(['/installation'])
      }
    });
  }
  constructor(private http:HttpClient,
    private route:Router
  ){}
  // key:apiKey[]=[];
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
