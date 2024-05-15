import { inject, Injectable } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, of } from "rxjs";
import { PROXY_PATH } from "../../tokens/proxy-path.token";
import {
    CalendarContainer,
    CalendarEditGet,
    CalendarEvent,
    CalendarIndexRoot,
    CalendarPost,
    CalendarsIndexParams,
    Countries
} from './calendars.interface';
import { DeleteAllItem, DeleteAllModalService } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';

@Injectable({
    providedIn: 'root',
})
export class CalendarsService implements DeleteAllModalService {

    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    public getIndex(params: CalendarsIndexParams): Observable<CalendarIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<CalendarIndexRoot>(`${proxyPath}/calendars/index.json`, {
            params: params as {} // cast CalendarsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public createCalendar(calendar: CalendarPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/calendars/add.json?angular=true`, {
            Calendar: calendar,
            events: calendar.events
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data as GenericIdResponse
                    };
                }),
                catchError((error: any) => {
                    const err = error.error.error as GenericValidationError;
                    return of({
                        success: false,
                        data: err
                    });
                })
            );
    }

    /*
    public getAdd(): Observable<CountriesAndContainers> {
        const proxyPath = this.proxyPath;
        return forkJoin([
            this.http.get<CalendarContainer[]>(`${proxyPath}/containers/loadContainersForAngular.json?angular=true`),
            this.http.get<CountryRoot>(`${proxyPath}/calendars/loadCountryList.json?angular=true`)
        ]).pipe(
            map(([containers, countries]) => {
                return {
                    containers: containers,
                    countries: countries.countries
                }
            }),
        );
    }*/

    public getContainers(): Observable<CalendarContainer[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            containers: CalendarContainer[]
        }>(`${proxyPath}/containers/loadContainersForAngular.json?angular=true`).pipe(
            map(data => {
                return data.containers;
            })
        );
    }

    public getCountries(): Observable<Countries> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            countries: Countries
        }>(`${proxyPath}/calendars/loadCountryList.json?angular=true`).pipe(
            map(
                data => {
                    return data.countries;
                }
            )
        );
    }


    public getEdit(id: number): Observable<CalendarEditGet> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            calendar: CalendarPost
        }>(`${proxyPath}/calendars/edit/${id}.json?angular=true`).pipe(
            map(data => {
                return data;
            })
        )
    }

    public updateCalendar(calendar: CalendarPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/calendars/edit/${calendar.id}.json?angular=true`, {
            Calendar: calendar
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data as GenericIdResponse
                    };
                }),
                catchError((error: any) => {
                    const err = error.error.error as GenericValidationError;
                    return of({
                        success: false,
                        data: err
                    });
                })
            );
    }

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/calendars/delete/${item.id}.json?angular=true`, {});
    }


    public getHolidays(countryCode: string): Observable<CalendarEvent[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            holidays: CalendarEvent[]
        }>(`${proxyPath}/calendars/loadHolidays/${countryCode}.json?angular=true`).pipe(
            map(data => {
                return data.holidays;
            })
        )
    }
}
