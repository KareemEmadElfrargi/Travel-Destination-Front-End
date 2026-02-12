import { Component, OnInit } from '@angular/core';
import { ToastService, ToastMessage } from '../../../services/toast.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
    selector: 'app-toast',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.css'],
    animations: [
        trigger('toastState', [
            state('void', style({
                transform: 'translateX(100%)',
                opacity: 0,
                height: 0,
                marginBottom: 0,
                padding: 0
            })),
            state('visible', style({
                transform: 'translateX(0)',
                opacity: 1,
                height: '*',
                marginBottom: '*',
                padding: '*'
            })),
            transition('void => visible', [
                animate('300ms cubic-bezier(0.16, 1, 0.3, 1)')
            ]),
            transition('visible => void', [
                animate('300ms cubic-bezier(0.16, 1, 0.3, 1)')
            ])
        ])
    ]
})
export class ToastComponent implements OnInit {
    toasts: ToastMessage[] = [];

    constructor(private toastService: ToastService) { }

    ngOnInit(): void {
        this.toastService.toasts$.subscribe(toasts => {
            this.toasts = toasts;
        });
    }

    removeToast(id: number): void {
        this.toastService.remove(id);
    }

    getToastClass(type: string): string {
        return `toast-${type}`;
    }

    getIcon(type: string): string {
        switch (type) {
            case 'success': return 'fa fa-check-circle';
            case 'error': return 'fa fa-exclamation-circle';
            case 'info': return 'fa fa-info-circle';
            case 'warning': return 'fa fa-exclamation-triangle';
            default: return 'fa fa-info-circle';
        }
    }
}
