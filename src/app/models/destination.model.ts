export interface Destination {
    id?: number; // Backend Entity likely has ID
    country: string; // Used as name in some contexts?
    capital: string;
    region: string;
    population: number;
    currency: string;
    flagImageUrl: string;
    description?: string;
}

export interface DestinationRequest {
    country: string;
    capital: string;
    region: string;
    population: number;
    currency: string;
    flagImageUrl: string;
}

export interface PaginatedDestinationResponse {
    content: Destination[];
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

// REST Countries API DTO
export interface CountryDto {
    name: { common: string };
    capital: string[];
    region: string;
    population: number;
    currencies: { [key: string]: { name: string, symbol: string } };
    flags: { png: string };
}
