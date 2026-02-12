import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DestinationService } from '../../../services/destination.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';

@Component({
    selector: 'app-add-destination',
    templateUrl: './add-destination.component.html'
})
export class AddDestinationComponent implements OnInit {
    addForm!: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private destinationService: DestinationService,
        private router: Router,
        private toastService: ToastService
    ) { }

    ngOnInit() {
        this.addForm = this.formBuilder.group({
            country: ['', Validators.required],
            capital: ['', Validators.required],
            region: ['', Validators.required],
            population: [0, [Validators.required, Validators.min(0)]],
            currency: ['', Validators.required],
            flagImageUrl: ['', Validators.required]
        });
    }

    get f() { return this.addForm.controls; }

    onSubmit() {
        this.submitted = true;

        if (this.addForm.invalid) {
            return;
        }

        this.loading = true;
        this.destinationService.addDestination(this.addForm.value)
            .subscribe({
                next: () => {
                    this.toastService.show('Destination added successfully', 'success');
                    this.router.navigate(['/admin/dashboard']);
                },
                error: (e) => {
                    this.toastService.show('Error adding destination', 'error');
                    this.loading = false;
                }
            });
    }
}
