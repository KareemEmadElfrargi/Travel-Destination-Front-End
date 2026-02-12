import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DestinationService } from '../../../services/destination.service';
import { WishlistService } from '../../../services/wishlist.service';
import { Destination } from '../../../models/destination.model';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
    selector: 'app-destination-details',
    templateUrl: './destination-details.component.html',
    styleUrls: ['./destination-details.component.css']
})
export class DestinationDetailsComponent implements OnInit {
    destination: Destination | null = null;
    loading = false;
    error = '';

    isAdmin = false;
    isInWishlist = false;

    constructor(
        private route: ActivatedRoute,
        private destinationService: DestinationService,
        private wishlistService: WishlistService,
        private authService: AuthService,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        this.checkAdmin();
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            const destId = parseInt(id);
            this.getDestination(destId);
            if (!this.isAdmin) {
                this.checkWishlistStatus(destId);
            }
        }
    }

    checkAdmin() {
        const user = this.authService.currentUserValue;
        this.isAdmin = user?.role === 'ADMIN' || user?.username === 'kareem';
    }

    checkWishlistStatus(id: number) {
        this.wishlistService.getWishlist().subscribe({
            next: (response) => {
                if (response.data) {
                    this.isInWishlist = response.data.some(d => d.id === id);
                }
            }
        });
    }

    toggleWishlist() {
        if (!this.destination || !this.destination.id) return;
        const id = this.destination.id;

        if (this.isInWishlist) {
            this.wishlistService.removeFromWishlist(id).subscribe({
                next: () => {
                    this.isInWishlist = false;
                    this.toastService.show('Removed from wishlist', 'info');
                },
                error: () => this.toastService.show('Failed to remove from wishlist', 'error')
            });
        } else {
            this.wishlistService.addToWishlist(id).subscribe({
                next: () => {
                    this.isInWishlist = true;
                    this.toastService.show('Added to wishlist!', 'success');
                },
                error: () => this.toastService.show('Failed to add to wishlist', 'error')
            });
        }
    }

    // Deprecated but kept for compatibility
    addToWishlist(destination: Destination) {
        this.toggleWishlist();
    }

    getDestination(id: number): void {
        this.loading = true;
        this.destinationService.getDestinationById(id)
            .subscribe({
                next: (data) => {
                    this.destination = data.data;
                    this.loading = false;
                },
                error: (e) => {
                    this.error = 'Destination not found';
                    this.loading = false;
                }
            });
    }
}
