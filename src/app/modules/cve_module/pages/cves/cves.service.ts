import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import {
    CveDecisionPost,
    CveDecideResponse,
    CvesCvesParams,
    CvesCvesRoot,
    CvesDecisionsParams,
    CvesDecisionsRoot,
    CvesFindingRoot,
    CvesHostComponentsParams,
    CvesHostComponentsRoot,
    CvesHostCoverageRoot,
    CvesHostFindingsParams,
    CvesHostFindingsRoot,
    CvesHostRoot,
    CvesHostStatesRoot,
    CvesIndexParams,
    CvesIndexRoot,
    CvesRecommendationsParams,
    CvesRecommendationsRoot,
    CvesSoftwareHostsParams,
    CvesSoftwareHostsRoot,
    CvesSoftwareParams,
    CvesSoftwareRoot,
    CvesSummaryRoot,
    CvesTrendRoot,
    CvesViewParams,
    CvesViewRoot
} from './cves.interface';
import { GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class CvesService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    /**********************
     *    Index action    *
     **********************/
    public getIndex(params: CvesIndexParams): Observable<CvesIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<CvesIndexRoot>(`${proxyPath}/cve_module/cves/index.json`, {
            params: params as {} // cast CvesIndexParams into object
        });
    }

    public getSummary(): Observable<CvesSummaryRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<CvesSummaryRoot>(`${proxyPath}/cve_module/cves/summary.json`, {
            params: {
                angular: true
            }
        });
    }

    /**
     * @param days Number of days up to today
     * @param hostId Values of one host, all hosts if not set
     */
    public getTrend(days: number, hostId?: number): Observable<CvesTrendRoot> {
        const proxyPath = this.proxyPath;
        const params: { [key: string]: string | number | boolean } = {
            angular: true,
            days: days
        };
        if (hostId) {
            params['host_id'] = hostId;
        }
        return this.http.get<CvesTrendRoot>(`${proxyPath}/cve_module/cves/trend.json`, {
            params: params
        });
    }

    /**********************
     *    Host action     *
     **********************/
    public getHost(hostId: number): Observable<CvesHostRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<CvesHostRoot>(`${proxyPath}/cve_module/cves/host/${hostId}.json`, {
            params: {
                angular: true
            }
        });
    }

    public getHostComponents(hostId: number, params: CvesHostComponentsParams): Observable<CvesHostComponentsRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<CvesHostComponentsRoot>(`${proxyPath}/cve_module/cves/host_components/${hostId}.json`, {
            params: params as {}
        });
    }

    public getHostFindings(hostId: number, params: CvesHostFindingsParams): Observable<CvesHostFindingsRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<CvesHostFindingsRoot>(`${proxyPath}/cve_module/cves/host_findings/${hostId}.json`, {
            params: params as {}
        });
    }

    public getHostCoverage(hostId: number): Observable<CvesHostCoverageRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<CvesHostCoverageRoot>(`${proxyPath}/cve_module/cves/host_coverage/${hostId}.json`, {
            params: {
                angular: true
            }
        });
    }

    /**
     * State of several hosts, hosts without evaluation or without permission are missing in the result.
     * The API answers at most 1000 hosts per request.
     */
    public getHostStates(hostIds: number[]): Observable<CvesHostStatesRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<CvesHostStatesRoot>(`${proxyPath}/cve_module/cves/host_states.json`, {
            params: {
                angular: true,
                'host_ids[]': hostIds
            }
        });
    }

    /**********************
     *   Finding action   *
     **********************/
    public getFinding(findingId: number): Observable<CvesFindingRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<CvesFindingRoot>(`${proxyPath}/cve_module/cves/finding/${findingId}.json`, {
            params: {
                angular: true
            }
        });
    }

    /**********************
     *  Decide actions    *
     **********************/

    /**
     * Creates or replaces the decision of all findings, all or nothing.
     * On a validation error data contains the errors of the fields of the form.
     */
    public decide(findingIds: number[], decision: CveDecisionPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<CveDecideResponse>(`${proxyPath}/cve_module/cves/decide.json?angular=true`, {
            finding_ids: findingIds,
            CveDecision: decision
        }).pipe(
            map(data => {
                return {
                    success: true,
                    data: data
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

    public removeDecision(findingIds: number[]): Observable<CveDecideResponse> {
        const proxyPath = this.proxyPath;
        return this.http.post<CveDecideResponse>(`${proxyPath}/cve_module/cves/remove_decision.json?angular=true`, {
            finding_ids: findingIds
        });
    }

    /**********************
     *  Decisions action  *
     **********************/
    public getDecisions(params: CvesDecisionsParams): Observable<CvesDecisionsRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<CvesDecisionsRoot>(`${proxyPath}/cve_module/cves/decisions.json`, {
            params: params as {}
        });
    }

    /**********************
     *    Cves action     *
     **********************/
    public getCves(params: CvesCvesParams): Observable<CvesCvesRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<CvesCvesRoot>(`${proxyPath}/cve_module/cves/cves.json`, {
            params: params as {}
        });
    }

    /**********************
     *    View action     *
     **********************/
    public getView(cveId: string, params: CvesViewParams): Observable<CvesViewRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<CvesViewRoot>(`${proxyPath}/cve_module/cves/view/${encodeURIComponent(cveId)}.json`, {
            params: params as {}
        });
    }

    /***************************
     * Recommendations action  *
     ***************************/
    public getRecommendations(params: CvesRecommendationsParams): Observable<CvesRecommendationsRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<CvesRecommendationsRoot>(`${proxyPath}/cve_module/cves/recommendations.json`, {
            params: params as {}
        });
    }

    /**********************
     *  Software action   *
     **********************/
    public getSoftware(params: CvesSoftwareParams): Observable<CvesSoftwareRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<CvesSoftwareRoot>(`${proxyPath}/cve_module/cves/software.json`, {
            params: params as {}
        });
    }

    // With component_name and component_version the API returns the hosts of this component
    public getSoftwareHosts(params: CvesSoftwareHostsParams): Observable<CvesSoftwareHostsRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<CvesSoftwareHostsRoot>(`${proxyPath}/cve_module/cves/software.json`, {
            params: params as {}
        });
    }
}
