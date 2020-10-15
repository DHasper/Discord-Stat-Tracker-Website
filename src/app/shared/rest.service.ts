import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  private URL: string = "http://192.168.178.34:8080";
  private options = {
    headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
  };

  constructor(private http: HttpClient) { }

  public getURL(): string {
    return this.URL;
  }

  /**
   * Do a http get to the backend.
   * 
   * @param path for backend endpoint.
   */
  public getRequest(path: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // console.log("Requested resource from " + this.URL + path);
      this.http.get(this.URL + "" + path).subscribe(
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      )
    }).catch((error) => {
      console.log("could not get resource " + path);
      console.log(error);
    });
  }
  
  /**
   * Do a http post to the backend.
   * 
   * @param path for backend endpoint.
   * @param params parameters to send in the body of the post
   */
  public postRequest(path: string, ...params: Array<Map<string, string>>): Promise<any> {
    return new Promise((resolve, reject) => {
      // console.log("Posted to " + this.URL + path);

      const body = new URLSearchParams();
      params.forEach(param => {
        for(let k of Array.from(param)){
          body.set(k[0], k[1])
        }
      });

      this.http.post(this.URL + "" + path, body.toString(), this.options).subscribe(
        res => {
          resolve(res);
        },
        err => {
          // resolve the error so we can handle status code
          resolve(err);
        }
      );
    }).catch((error) => {
      console.log("POST request unsuccessful " + path);
      console.log("Error " + error.status + " " + error.statusText);
      // console.log(error);
    });
  }

}
