import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Destination } from '../models/destination.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class WishlistService {
    private apiUrl = `${environment.apiUrl}/user/wishlist`;

    constructor(private http: HttpClient) { }

    getWishlist(): Observable<ApiResponse<Destination[]>> {
        return this.http.get<ApiResponse<Destination[]>>(this.apiUrl);
    }

    addToWishlist(destinationId: number): Observable<ApiResponse<void>> {
        return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${destinationId}`, {});
    }

    removeFromWishlist(destinationId: number): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${destinationId}`);
    }
}
