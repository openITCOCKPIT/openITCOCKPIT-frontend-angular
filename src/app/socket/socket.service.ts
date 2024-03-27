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

  private socket: WebSocket | null = null;

  private uniqId: string = '';

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

        this.socket = new WebSocket(data.websocket["SUDO_SERVER.URL"]);

        this.socket.onopen = (event: Event) => this.onOpen(event);
        this.socket.onmessage = (event: MessageEvent) => this.onMessage(event);
        this.socket.onclose = (event: CloseEvent) => this.onClose(event);
        this.socket.onerror = (event: Event) => this.onError(event);
      }
    })
  }

  private send(json: any): void {
    this.socket?.send(json)
  }

  private onOpen(event: Event): void {
    console.log('WebSocket.onopen event', event);
  }
  private onMessage(event: MessageEvent): void {
    console.log('WebSocket.onmessage event', event);

    const transmitted = JSON.parse(event.data);
    switch(transmitted.type){
      case 'connection':
        //New connection was established successfully
        //Save UUID, the server give us
        this.uniqId = transmitted.uniqid;


        //Trigger _onSuccess callback and start keepAlive
        this.onSuccess(event);
        break;

      case 'response':
        //Server response to a request we sent
        if(this.uniqId === transmitted.uniqid){
          this.onResponse(event);
        }
        break;

      case 'dispatcher':
        //Received some broadcast message
        this.onDispatch(event);
        break;

      case 'keepAlive':
        // Server is still alive :-)
        break;
    }
  }
  private onClose(event: CloseEvent): void {
    console.log('WebSocket.onclose event', event);
  }
  private onError(event: Event): void {
    console.log('WebSocket.onerror event', event);
  }

  private onDispatch(event: MessageEvent): void {
    console.log('onDispatch', event);
  }

  private onSuccess(event: MessageEvent): void {
    console.log('onSuccess', event);
  }

  private onResponse(event: MessageEvent): void {
    console.log('onResponse', event);
  }
}
