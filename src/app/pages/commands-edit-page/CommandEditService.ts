import {inject, Injectable, Signal, signal, WritableSignal} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {switchMap, Observable, map, tap, catchError, of, BehaviorSubject, retry} from "rxjs";
import {PROXY_PATH} from "../../tokens/proxy-path.token";
import {CommandEdit} from './CommandEdit.interface';

@Injectable({
  providedIn: 'root',
})
export class CommandEditService {

  private readonly http = inject(HttpClient);
  private readonly document = inject(DOCUMENT);
  private readonly proxyPath = inject(PROXY_PATH);

  public load(id: number): Observable<CommandEdit> {
    const proxyPath = this.proxyPath;
    return this.http.get<{ command: CommandEdit }>(`${proxyPath}/commands/edit/${id}.json?angular=true`).pipe(
      map(data => {
        return data['command'];
      })
    )
  }

}
