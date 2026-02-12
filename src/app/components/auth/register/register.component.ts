import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    registerForm!: FormGroup;
    loading = false;
    submitted = false;
    error = '';
    success = '';
    showPassword = false;

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService
    ) {
        // redirect to home if already logged in
        if (this.authService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            username: ['', [Validators.required, Validators.minLength(3)]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        this.authService.register(this.registerForm.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.success = 'Registration successful';
                    this.router.navigate(['/login']);
                },
                error: (error: any) => {
                    const errorObj = error.error;
                    if (errorObj && errorObj.data && typeof errorObj.data === 'object' && Object.keys(errorObj.data).length > 0) {
                        // Extract validation messages from the data object
                        this.error = Object.values(errorObj.data).join('\n');
                    } else if (errorObj && typeof errorObj === 'string') {
                        this.error = errorObj;
                    } else if (errorObj && errorObj.message) {
                        this.error = errorObj.message;
                    } else {
                        this.error = 'Registration failed. Please try again.';
                    }
                    this.loading = false;
                }
            });
    }
}
