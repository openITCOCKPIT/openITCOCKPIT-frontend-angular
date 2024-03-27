import {inject, Injectable} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {filter, switchMap, take} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {PROXY_PATH} from "../tokens/proxy-path.token";
import {Socket} from "ngx-socket-io";



@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);
  private readonly proxyPath = inject(PROXY_PATH);

  private socket: Socket | null = null;

  constructor() {
    this.authService.authenticated$.pipe(
      filter(authenticated => authenticated),
      take(1),
      switchMap(
      () => {
        const proxyPath = this.proxyPath;
        return this.http.get<{
          websocket: {
            'SUDO_SERVER.URL': string,
            'SUDO_SERVER.API_KEY': string
          }
        }>(`${proxyPath}/angular/websocket_configuration.json?angular=true`);
      }
    )).subscribe({
      next: data => {
        console.log('websocket conf', data);



        this.socket = new Socket({
          url: data.websocket["SUDO_SERVER.URL"],
          options: {
            withCredentials: true,
          }
        });
      }
    })
  }
}
