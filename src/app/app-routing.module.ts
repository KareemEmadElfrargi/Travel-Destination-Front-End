import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';

import { DestinationsListComponent } from './components/user/destinations-list/destinations-list.component';
import { DestinationDetailsComponent } from './components/user/destination-details/destination-details.component';
import { WishlistComponent } from './components/user/wishlist/wishlist.component';

import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { SuggestionsComponent } from './components/admin/suggestions/suggestions.component';
import { AddDestinationComponent } from './components/admin/add-destination/add-destination.component';

import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
    { path: '', redirectTo: '/destinations', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    { path: 'destinations', component: DestinationsListComponent, canActivate: [AuthGuard] },
    { path: 'destinations/:id', component: DestinationDetailsComponent, canActivate: [AuthGuard] },
    { path: 'wishlist', component: WishlistComponent, canActivate: [AuthGuard], data: { roles: ['USER'] } },

    { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
    { path: 'admin/suggestions', component: SuggestionsComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
    { path: 'admin/add-destination', component: AddDestinationComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },

    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
