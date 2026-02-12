import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(private authService: AuthService) { }

    get currentUser() {
        return this.authService.currentUserValue;
    }

    ngOnInit() {
        this.authService.currentUser.subscribe(x => {
            console.log('AppComponent --> Current User Update:', x);
            if (x) {
                console.log('   -> Role:', x.role);
                console.log('   -> Is Admin?', x.role === 'ADMIN');
            }
        });
    }

    logout() {
        this.authService.logout();
    }
}
