import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Destination, DestinationRequest, PaginatedDestinationResponse, CountryDto } from '../models/destination.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DestinationService {
    private userApiUrl = `${environment.apiUrl}/user/destinations`;
    private adminApiUrl = `${environment.apiUrl}/admin/destinations`;
    private suggestionsApiUrl = `${environment.apiUrl}/admin/suggestions`;

    constructor(private http: HttpClient) { }

    getAllDestinations(page: number = 0, size: number = 9): Observable<ApiResponse<PaginatedDestinationResponse>> {
        let params = new HttpParams().set('page', page).set('size', size);
        return this.http.get<ApiResponse<PaginatedDestinationResponse>>(this.userApiUrl, { params });
    }

    getDestinationById(id: number): Observable<ApiResponse<Destination>> {
        return this.http.get<ApiResponse<Destination>>(`${this.userApiUrl}/${id}`);
    }

    searchDestinations(query: string): Observable<ApiResponse<Destination[]>> {
        let params = new HttpParams().set('query', query);
        return this.http.get<ApiResponse<Destination[]>>(`${this.userApiUrl}/search`, { params });
    }

    
    addDestination(destination: DestinationRequest): Observable<ApiResponse<Destination>> {
        return this.http.post<ApiResponse<Destination>>(this.adminApiUrl, destination);
    }

    bulkAddDestinations(destinations: DestinationRequest[]): Observable<ApiResponse<List<Destination>>> {
        return this.http.post<ApiResponse<List<Destination>>>(`${this.adminApiUrl}/bulk`, destinations);
    }

    deleteDestination(id: number): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.adminApiUrl}/${id}`);
    }

    getSuggestions(): Observable<ApiResponse<Destination[]>> {
        return this.http.get<ApiResponse<Destination[]>>(this.suggestionsApiUrl);
    }
}

type List<T> = T[];
