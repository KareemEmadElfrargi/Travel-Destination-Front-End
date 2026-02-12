import { Component, OnInit } from '@angular/core';
import { DestinationService } from '../../../services/destination.service';
import { Destination } from '../../../models/destination.model';

@Component({
    selector: 'app-suggestions',
    templateUrl: './suggestions.component.html',
    styleUrls: ['./suggestions.component.css']
})
export class SuggestionsComponent implements OnInit {
    suggestions: any[] = [];
    loading = false;
    error = '';
    // Modal & Toast State
    showAddModal = false;
    modalMode: 'single' | 'bulk' = 'single';
    itemToAdd: any | null = null;
    toastMessage: string | null = null;
    toastType: 'success' | 'error' = 'success';

    selectedDestinations: Set<any> = new Set();

    constructor(private destinationService: DestinationService) { }

    ngOnInit(): void {
        this.loadSuggestions();
    }

    loadSuggestions() {
        this.loading = true;
        this.destinationService.getSuggestions()
            .subscribe({
                next: (response) => {
                    this.suggestions = response.data;
                    this.loading = false;
                },
                error: (e) => {
                    this.error = 'Failed to load suggestions from backend API';
                    this.loading = false;
                    console.error(e);
                }
            });
    }

    /* SELECT LOGIC */
    toggleSelection(dest: any) {
        if (this.selectedDestinations.has(dest)) {
            this.selectedDestinations.delete(dest);
        } else {
            this.selectedDestinations.add(dest);
        }
    }

    isSelected(dest: any): boolean {
        return this.selectedDestinations.has(dest);
    }

    /* MODAL LOGIC */
    // 1. Open Modal for Single Add
    openAddModal(dest: any) {
        this.modalMode = 'single';
        this.itemToAdd = dest;
        this.showAddModal = true;
    }

    // 2. Open Modal for Bulk Add
    openBulkAddModal() {
        if (this.selectedDestinations.size === 0) return;
        this.modalMode = 'bulk';
        this.showAddModal = true;
    }

    // 3. Confirm Action based on mode
    confirmAdd() {
        if (this.modalMode === 'single' && this.itemToAdd) {
            this.performSingleAdd(this.itemToAdd);
        } else if (this.modalMode === 'bulk') {
            this.performBulkAdd();
        }
    }

    /* API ACTIONS */
    performSingleAdd(dest: any) {
        const request: any = {
            country: dest.country,
            capital: dest.capital,
            region: dest.region,
            population: dest.population,
            currency: dest.currency,
            flagImageUrl: dest.flagImageUrl,
            description: dest.description || `Explore the beauty of ${dest.country}`
        };

        this.destinationService.addDestination(request).subscribe({
            next: () => {
                this.showToast(`${dest.country} added successfully!`, 'success');
                this.suggestions = this.suggestions.filter(s => s.country !== dest.country);
                this.closeAddModal();
            },
            error: (err) => {
                this.showToast('Failed to add destination', 'error');
                console.error(err);
                this.closeAddModal();
            }
        });
    }

    performBulkAdd() {
        const requests = Array.from(this.selectedDestinations).map(dest => ({
            country: dest.country,
            capital: dest.capital,
            region: dest.region,
            population: dest.population,
            currency: dest.currency,
            flagImageUrl: dest.flagImageUrl,
            description: dest.description || `Explore the beauty of ${dest.country}`
        }));

        this.loading = true; // Show loading if needed, or rely on toast
        this.destinationService.bulkAddDestinations(requests).subscribe({
            next: (response) => {
                this.showToast(`Successfully added ${requests.length} destinations!`, 'success');

                // Remove added items from list
                this.suggestions = this.suggestions.filter(s => !this.selectedDestinations.has(s));
                this.selectedDestinations.clear();

                this.loading = false;
                this.closeAddModal();
            },
            error: (e) => {
                console.error('Bulk add error:', e);
                this.showToast('Failed to add destinations', 'error');
                this.loading = false;
                this.closeAddModal();
            }
        });
    }

    closeAddModal() {
        this.showAddModal = false;
        this.itemToAdd = null;
    }

    /* TOAST HELPER */
    showToast(message: string, type: 'success' | 'error') {
        this.toastMessage = message;
        this.toastType = type;
        setTimeout(() => {
            this.toastMessage = null;
        }, 3000);
    }
}
