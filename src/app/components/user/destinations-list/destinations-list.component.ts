import { Component, OnInit } from '@angular/core';
import { DestinationService } from '../../../services/destination.service';
import { WishlistService } from '../../../services/wishlist.service';
import { Destination, PaginatedDestinationResponse } from '../../../models/destination.model';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
    selector: 'app-destinations-list',
    templateUrl: './destinations-list.component.html',
    styleUrls: ['./destinations-list.component.css']
})
export class DestinationsListComponent implements OnInit {
    destinations: Destination[] = [];
    page = 0;
    size = 9;
    totalElements = 0;
    totalPages = 0;
    loading = false;
    searchQuery = '';
    isAdmin = false;

    // Wishlist Management
    wishlistIds: Set<number> = new Set();

    constructor(
        private destinationService: DestinationService,
        private wishlistService: WishlistService,
        private authService: AuthService,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        this.checkAdmin();
        this.loadDestinations();
        this.loadWishlistIds(); // Load user favorites
    }

    // Delete Modal State
    showDeleteModal = false;
    destinationToDeleteId: number | null = null;

    checkAdmin() {
        const user = this.authService.currentUserValue;
        this.isAdmin = user?.role === 'ADMIN' || user?.username === 'kareem';
    }

    get currentUser() {
        return this.authService.currentUserValue;
    }

    // 1. Open Modal
    deleteDestination(id?: number) {
        if (!id) return;
        this.destinationToDeleteId = id;
        this.showDeleteModal = true;
    }

    // 2. Confirm Action
    confirmDelete() {
        if (!this.destinationToDeleteId) return;

        this.destinationService.deleteDestination(this.destinationToDeleteId).subscribe({
            next: () => {
                this.toastService.show('Destination deleted successfully!', 'success');
                this.destinations = this.destinations.filter(d => d.id !== this.destinationToDeleteId);
                this.closeDeleteModal();
            },
            error: (e) => {
                console.error(e);
                if (e.status === 500) {
                    this.toastService.show('Cannot delete: Destination is in use by users (wishlist)', 'error');
                } else {
                    this.toastService.show('Failed to delete destination.', 'error');
                }
                this.closeDeleteModal();
            }
        });
    }

    // 3. Cancel/Close
    closeDeleteModal() {
        this.showDeleteModal = false;
        this.destinationToDeleteId = null;
    }

    loadDestinations() {
        this.loading = true;
        this.destinationService.getAllDestinations(this.page, this.size)
            .subscribe({
                next: (response) => {
                    this.destinations = response.data.content;
                    this.totalElements = response.data.totalElements;
                    this.totalPages = response.data.totalPages;
                    this.loading = false;
                },
                error: (e) => {
                    console.error(e);
                    this.loading = false;
                }
            });
    }

    loadWishlistIds() {
        // Only load if user is logged in (not admin specifically, any user)
        if (this.authService.isAuthenticated()) {
            this.wishlistService.getWishlist().subscribe({
                next: (response) => {
                    // Create a Set of IDs for O(1) lookup
                    if (response.data) {
                        this.wishlistIds = new Set(response.data.map(d => d.id).filter((id): id is number => !!id));
                    }
                },
                error: (e) => console.error('Failed to load wishlist status', e)
            });
        }
    }

    // New smart toggle method
    toggleWishlist(destination: Destination) {
        if (!destination.id) return;
        const id = destination.id;

        if (this.wishlistIds.has(id)) {
            // Already in wishlist -> Remove it
            this.wishlistService.removeFromWishlist(id).subscribe({
                next: () => {
                    this.wishlistIds.delete(id);
                    this.toastService.show(`${destination.country} removed from your wishlist`, 'info');
                },
                error: () => this.toastService.show('Failed to remove from wishlist', 'error')
            });
        } else {
            // Not in wishlist -> Add it
            this.wishlistService.addToWishlist(id).subscribe({
                next: () => {
                    this.wishlistIds.add(id);
                    this.toastService.show(`${destination.country} added to your wishlist!`, 'success');
                },
                error: () => this.toastService.show('Failed to add to wishlist', 'error')
            });
        }
    }

    // Check helper for UI
    isInWishlist(id?: number): boolean {
        return !!id && this.wishlistIds.has(id);
    }



    onPageChange(newPage: number) {
        this.page = newPage;
        this.loadDestinations();
    }

    onSearch() {
        this.page = 0;
        this.totalPages = 0;
        this.totalElements = 0;

        if (this.searchQuery.trim()) {
            this.loading = true;
            this.destinationService.searchDestinations(this.searchQuery)
                .subscribe({
                    next: (response) => {
                        this.destinations = response.data;
                        this.totalElements = response.data.length;
                        this.totalPages = 1;
                        this.loading = false;
                    },
                    error: (e) => {
                        console.error(e);
                        this.loading = false;
                    }
                });
        } else {
            this.loadDestinations();
        }
    }

    // Deprecated but kept to avoid strict template errors if referenced
    addToWishlist(destination: Destination) {
        this.toggleWishlist(destination);
    }
}
