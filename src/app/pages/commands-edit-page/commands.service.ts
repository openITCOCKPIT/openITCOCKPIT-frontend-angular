import { inject, Injectable } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { PROXY_PATH } from "../../tokens/proxy-path.token";
import { CommandEdit } from './CommandEdit.interface';

@Injectable({
  providedIn: 'root',
})
export class CommandsService {

  private readonly http = inject(HttpClient);
  private readonly document = inject(DOCUMENT);
  private readonly proxyPath = inject(PROXY_PATH);

  public getEdit(id: number): Observable<CommandEdit> {
    const proxyPath = this.proxyPath;
    return this.http.get<{ command: CommandEdit }>(`${proxyPath}/commands/edit/${id}.json?angular=true`).pipe(
      map(data => {
        return data['command'];
      })
    )
  }

}
