import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DestinationsListComponent } from './components/user/destinations-list/destinations-list.component';
import { DestinationDetailsComponent } from './components/user/destination-details/destination-details.component';
import { WishlistComponent } from './components/user/wishlist/wishlist.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { SuggestionsComponent } from './components/admin/suggestions/suggestions.component';
import { AddDestinationComponent } from './components/admin/add-destination/add-destination.component';
import { ToastComponent } from './components/shared/toast/toast.component';

import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { AuthService } from './services/auth.service';
import { DestinationService } from './services/destination.service';
import { WishlistService } from './services/wishlist.service';
import { AuthGuard } from './guards/auth.guard';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        DestinationsListComponent,
        DestinationDetailsComponent,
        WishlistComponent,
        AdminDashboardComponent,
        SuggestionsComponent,
        AddDestinationComponent,
        ToastComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        AuthService,
        DestinationService,
        WishlistService,
        AuthGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
