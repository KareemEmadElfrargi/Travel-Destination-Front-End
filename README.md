# Travel App

A comprehensive travel destination management application built with **Angular**. This application allows users to browse destinations, manage a wishlist, and provides an admin interface for managing content.

##  Getting Started

Follow these steps to get a copy of the project up and running on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:
1.  **Node.js** (LTS version recommended)
2.  **Angular CLI**: Install globally using:
    ```bash
    npm install -g @angular/cli
    ```
3.  **Backend Server**: Ensure your backend API is running on port `8081`.
  Check this repo : https://github.com/KareemEmadElfrargi/Travel-Destination

### Installation

1.  **Clone the repository**
    ```bash
    git clone <https://github.com/KareemEmadElfrargi/Travel-Destination-Front-End.git>
    cd Travel-Destination-Front-End
    ```

2.  **Install Dependencies**
    This downloads all the libraries listed in `package.json` (like Angular, Bootstrap, etc.).
    ```bash
    npm install
    ```

### Running the Application

1.  **Start the Backend**
    Make sure your backend server is running at `http://localhost:8081`.

2.  **Start the Frontend**
    Run the development server:
    ```bash
    ng serve
    ```

3.  **Open in Browser**
    Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

---

##  Project Architecture & "The Why"

This section explains the technical decisions made in the code (specifically in `app.module.ts` and `environment.ts`) so you can understand the reasoning behind the structure.

### 1. Environment Configuration
**File:** `src/environments/environment.ts`
*   **What:** We defined `apiUrl: 'http://localhost:8081'`.
*   **Why:** We avoid hardcoding URLs inside components. By keeping the API URL in a central environment file, we can easily switch between a local backend and a live production server without rewriting code.

### 2. HTTP Client & Interceptors
**File:** `src/app/app.module.ts`
*   **What:** We imported `HttpClientModule` and registered `JwtInterceptor`.
*   **Why:**
    *   `HttpClientModule`: Angular doesn't include HTTP capabilities by default to save space. We import this to enable communication with the backend.
    *   `JwtInterceptor`: Instead of manually adding the "Authorization: Bearer token" header to every single API call, this interceptor catches every outgoing request and attaches the token automatically.

### 3. Services
**Files:** `AuthService`, `DestinationService`, `WishlistService`
*   **What:** We created specific classes for data handling.
*   **Why:** **Separation of Concerns.** Components (like `DestinationsListComponent`) should only care about *displaying* data. Services care about *fetching* data. This makes the app easier to test and maintain.

### 4. Route Guards
**File:** `AuthGuard`
*   **What:** Added to the providers and routing module.
*   **Why:** We need to protect specific pages (like the Admin Dashboard or User Wishlist). The Guard checks if a user is logged in *before* Angular loads the page. If they aren't, it redirects them to Login.

### 5. Shared Components (Toast)
**File:** `ToastComponent`
*   **What:** A global component for notifications.
*   **Why:** Instead of creating a success message inside every single component (Login, Register, Add Destination), we built one global "Toast" system. Any component can call `toastService.success('Message')` to show a popup, keeping the UI consistent.

##  Folder Structure

```text
src/app
├── components
│   ├── admin       # Admin-only features (Dashboard, Add Destination)
│   ├── auth        # Login and Register pages
│   ├── shared      # Reusable UI elements (Toast notifications)
│   └── user        # User-facing features (Destination List, Wishlist)
├── guards          # Route protection logic
├── interceptors    # HTTP request modification (Token attachment)
└── services        # API communication logic
```
