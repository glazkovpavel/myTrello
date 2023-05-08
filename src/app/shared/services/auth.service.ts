import {Injectable, OnInit} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {IUserInterface} from "../../interface/user.interface";
import {Observable, of, Subscription} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {IUserLoginInterface} from "../../interface/user-login.interface";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit{
  public isAuth: boolean;
  private isUrl: string = 'http://localhost:3000'

  private isUrlOAuthYandex: string = 'https://oauth.yandex.ru/authorize?response_type=code&client_id=31026068d92a40e791f27a255ea85f18&redirect_uri=http%3A%2F%2Flocalhost%3A4200';

  constructor( private http: HttpClient, private route: Router ) {
  }

  ngOnInit(): void {

  }

  // loginInYandexOAuth(): Observable<Object> {
  //   //return this.route.navigate()
  // }

  loginIn(userLogin: IUserLoginInterface): Subscription {
    return this.http.post<any>(`${this.isUrl}/signin`, userLogin)
      .pipe(map(({token: token}) => {
        this.isAuth = true;
         localStorage.setItem('jwt', token);
         this.route.navigate(['/home'])

        }),
        catchError(() => of(null))
      ).subscribe()
  }

  logout() {
    this.isAuth = false;
    localStorage.removeItem('jwt');
    localStorage.removeItem('userInfo');
  }

  register(user: IUserInterface): Observable<any> {
    return this.http.post<any>(`${this.isUrl}/signup`, user)
      .pipe(map((userResponse) => {
        if(userResponse) {
          const userLogin = {
            email: userResponse.user.email,
            password: user.password
          }
          this.loginIn(userLogin)
        }
      }),
        catchError(map(value => console.log(value)))
      )
  }

  isAuthenticated(): Observable<boolean> {

    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      this.isAuth = true;
      return of( true);
    }
    this.isAuth = false
    return of( false);
  }

}
