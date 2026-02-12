import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthService } from '../../../services/auth.service';

@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
    loading = false;
    submitted = false;
    error = '';


    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.loginForm.value)
            .subscribe({
                next: (response: any) => {
                    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
                    // If returnUrl is set, prioritize it. Otherwise check role.
                    if (returnUrl) {
                        this.router.navigate([returnUrl]);
                    } else {
                        // Decode token to check role immediately
                        const role = this.authenticationService.getUserRole();
                        console.log('Login successful. Detected role:', role);

                        if (role === 'ADMIN') {
                            console.log('Redirecting to /admin');
                            this.router.navigate(['/admin']);
                        } else {
                            console.log('Redirecting to /destinations');
                            this.router.navigate(['/destinations']); // Better than /
                        }
                    }
                },
                error: (error: any) => {
                    console.error('Login error:', error);
                    this.error = 'Invalid username or password';
                    this.loading = false;
                }
            });
    }
}
