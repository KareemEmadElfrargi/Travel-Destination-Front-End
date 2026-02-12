import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../../services/wishlist.service';
import { Destination } from '../../../models/destination.model';

@Component({
    selector: 'app-wishlist',
    templateUrl: './wishlist.component.html',
    styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
    wishlist: Destination[] = [];
    loading = false;
    error = '';

    // Modal & Toast State
    showDeleteModal = false;
    itemToDeleteId: number | null = null;
    toastMessage: string | null = null;
    toastType: 'success' | 'error' = 'success';

    constructor(private wishlistService: WishlistService) { }

    ngOnInit(): void {
        this.getWishlist();
    }

    getWishlist(): void {
        this.loading = true;
        this.wishlistService.getWishlist()
            .subscribe({
                next: (response) => {
                    this.wishlist = response.data;
                    this.loading = false;
                },
                error: (e) => {
                    this.error = 'Failed to load wishlist';
                    this.loading = false;
                }
            });
    }

    // 1. Open Modal
    onRemoveClick(id?: number): void {
        if (!id) return;
        this.itemToDeleteId = id;
        this.showDeleteModal = true;
    }

    // 2. Confirm Removal
    confirmRemove(): void {
        if (!this.itemToDeleteId) return;

        this.wishlistService.removeFromWishlist(this.itemToDeleteId).subscribe({
            next: () => {
                this.wishlist = this.wishlist.filter(item => item.id !== this.itemToDeleteId);
                this.showToast('Removed from wishlist', 'success');
                this.closeDeleteModal();
            },
            error: () => {
                this.showToast('Failed to remove', 'error');
                this.closeDeleteModal();
            }
        });
    }

    // 3. Close Modal
    closeDeleteModal(): void {
        this.showDeleteModal = false;
        this.itemToDeleteId = null;
    }

    showToast(message: string, type: 'success' | 'error') {
        this.toastMessage = message;
        this.toastType = type;
        setTimeout(() => {
            this.toastMessage = null;
        }, 3000);
    }
}
