# 🏥 Pharmacy Management Platform - Development Roadmap

## Project Overview
A modern multi-pharmacy management platform where:
- **Super Admin** manages all pharmacies, monitors stock, and supplies medicines
- **Pharmacy Owners** get their own complete management system + POS + ecommerce site
- **Customers** can search medicines across pharmacies, view maps, and buy from specific pharmacies

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Backend | Laravel 11 (API) |
| Frontend | React 18 + Vite |
| Database | MySQL 8.0 |
| Multi-tenancy | Subdomain-based |
| Maps | Leaflet + OpenStreetMap |
| Payments | Stripe + COD |
| Auth | Laravel Sanctum |
| Search | Laravel Scout + MySQL Full-text |
| Styling | TailwindCSS |

## Estimated Timeline: 20 Weeks (5 Months)

---

# 📋 PHASE 1: Project Foundation & Architecture (Week 1-2)

## Objective
Set up the complete project structure, database foundation, and multi-tenancy architecture.

## 1.1 Laravel Backend Setup
### Commands to Run:
```bash
# Create Laravel project
composer create-project laravel/laravel pharmacy-backend
cd pharmacy-backend

# Install required packages
composer require laravel/sanctum
composer require laravel/scout
composer require spatie/laravel-permission
composer require spatie/laravel-medialibrary
composer require barryvdh/laravel-dompdf

# Publish configurations
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
```

### Directory Structure:
```
pharmacy-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/
│   │   │   │   ├── SuperAdmin/
│   │   │   │   │   ├── DashboardController.php
│   │   │   │   │   ├── PharmacyController.php
│   │   │   │   │   ├── MedicineController.php
│   │   │   │   │   ├── SupplyController.php
│   │   │   │   │   └── ReportController.php
│   │   │   │   ├── Pharmacy/
│   │   │   │   │   ├── DashboardController.php
│   │   │   │   │   ├── MedicineController.php
│   │   │   │   │   ├── StockController.php
│   │   │   │   │   ├── OrderController.php
│   │   │   │   │   ├── POSController.php
│   │   │   │   │   └── SettingController.php
│   │   │   │   └── Customer/
│   │   │   │       ├── SearchController.php
│   │   │   │       ├── OrderController.php
│   │   │   │       └── AuthController.php
│   │   │   └── Auth/
│   │   ├── Middleware/
│   │   │   ├── ResolvePharmacy.php
│   │   │   ├── RoleMiddleware.php
│   │   │   └── EnsurePharmacyIsActive.php
│   │   └── Requests/
│   ├── Models/
│   │   ├── Traits/
│   │   │   ├── BelongsToPharmacy.php
│   │   │   └── HasRoles.php
│   │   ├── User.php
│   │   ├── Pharmacy.php
│   │   ├── Medicine.php
│   │   ├── MedicineStock.php
│   │   ├── Category.php
│   │   ├── Order.php
│   │   ├── OrderItem.php
│   │   ├── SupplyOrder.php
│   │   ├── SupplyOrderItem.php
│   │   └── Review.php
│   ├── Services/
│   │   ├── PharmacyResolver.php
│   │   ├── InventoryService.php
│   │   ├── SupplyChainService.php
│   │   └── SearchService.php
│   └── Observers/
│       ├── MedicineStockObserver.php
│       └── OrderObserver.php
├── database/
│   ├── migrations/
│   │   ├── 0001_01_01_000001_create_users_table.php
│   │   ├── 0001_01_01_000002_create_pharmacies_table.php
│   │   ├── 0001_01_01_000003_create_categories_table.php
│   │   ├── 0001_01_01_000004_create_medicines_table.php
│   │   ├── 0001_01_01_000005_create_medicine_stocks_table.php
│   │   ├── 0001_01_01_000006_create_orders_table.php
│   │   ├── 0001_01_01_000007_create_order_items_table.php
│   │   ├── 0001_01_01_000008_create_supply_orders_table.php
│   │   ├── 0001_01_01_000009_create_supply_order_items_table.php
│   │   ├── 0001_01_01_000010_create_reviews_table.php
│   │   └── 0001_01_01_000011_create_pharmacy_settings_table.php
│   ├── seeders/
│   │   ├── RoleSeeder.php
│   │   ├── CategorySeeder.php
│   │   └── MedicineSeeder.php
│   └── factories/
└── routes/
    ├── api.php
    └── web.php
```

### .env Configuration:
```env
# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pharmacy_platform
DB_USERNAME=root
DB_PASSWORD=

# Multi-tenancy
PLATFORM_DOMAIN=yourplatform.com
SUBDOMAIN_ENABLED=true

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Stripe
STRIPE_KEY=your_stripe_key
STRIPE_SECRET=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

## 1.2 React Frontend Setup
### Commands to Run:
```bash
# Create React project
npm create vite@latest pharmacy-frontend -- --template react
cd pharmacy-frontend

# Install dependencies
npm install react-router-dom axios @tanstack/react-query
npm install tailwindcss @tailwindcss/vite
npm install zustand
npm install leaflet react-leaflet
npm install react-hot-toast
npm install lucide-react
npm install recharts

# Setup Tailwind
npm install -D @types/leaflet
```

### Frontend Structure:
```
pharmacy-frontend/
├── src/
│   ├── apps/
│   │   ├── superadmin/        # Super Admin Panel
│   │   │   ├── pages/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Pharmacies/
│   │   │   │   │   ├── Index.jsx
│   │   │   │   │   ├── Show.jsx
│   │   │   │   │   └── Create.jsx
│   │   │   │   ├── Medicines/
│   │   │   │   ├── Supply/
│   │   │   │   ├── Reports/
│   │   │   │   └── Settings/
│   │   │   ├── components/
│   │   │   └── layouts/
│   │   ├── pharmacy/          # Pharmacy Owner Panel
│   │   │   ├── pages/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Medicines/
│   │   │   │   ├── Stock/
│   │   │   │   ├── Orders/
│   │   │   │   ├── POS/
│   │   │   │   └── Settings/
│   │   │   ├── components/
│   │   │   └── layouts/
│   │   ├── customer/          # Public E-commerce
│   │   │   ├── pages/
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── Search.jsx
│   │   │   │   ├── MedicineDetail.jsx
│   │   │   │   ├── Cart.jsx
│   │   │   │   ├── Checkout.jsx
│   │   │   │   └── OrderHistory.jsx
│   │   │   ├── components/
│   │   │   │   ├── SearchBar.jsx
│   │   │   │   ├── MedicineCard.jsx
│   │   │   │   ├── PharmacyCard.jsx
│   │   │   │   ├── MapView.jsx
│   │   │   │   └── ListView.jsx
│   │   │   └── layouts/
│   │   └── pos/               # Standalone POS
│   │       ├── pages/
│   │       └── components/
│   ├── shared/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Table.jsx
│   │   │   │   └── Card.jsx
│   │   │   └── layout/
│   │   │       ├── Sidebar.jsx
│   │   │       ├── Header.jsx
│   │   │       └── Footer.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── usePharmacy.js
│   │   │   └── useDebounce.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── auth.service.js
│   │   │   ├── pharmacy.service.js
│   │   │   ├── medicine.service.js
│   │   │   └── order.service.js
│   │   └── store/
│   │       ├── authStore.js
│   │       ├── cartStore.js
│   │       └── pharmacyStore.js
│   ├── App.jsx
│   └── main.jsx
├── vite.config.js
└── package.json
```

## 1.3 Database Migrations

### users_table.php:
```php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->timestamp('email_verified_at')->nullable();
    $table->string('password');
    $table->enum('role', ['super_admin', 'pharmacy_owner', 'pharmacy_staff', 'customer']);
    $table->foreignId('pharmacy_id')->nullable()->constrained();
    $table->string('phone')->nullable();
    $table->string('avatar')->nullable();
    $table->boolean('is_active')->default(true);
    $table->rememberToken();
    $table->timestamps();
});
```

### pharmacies_table.php:
```php
Schema::create('pharmacies', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('slug')->unique();
    $table->string('subdomain')->unique();
    $table->foreignId('owner_id')->constrained('users');
    $table->text('description')->nullable();
    $table->string('logo')->nullable();
    $table->string('cover_image')->nullable();
    $table->string('license_no');
    $table->string('phone');
    $table->string('email');
    $table->text('address');
    $table->string('city');
    $table->string('state');
    $table->string('zip_code');
    $table->decimal('latitude', 10, 8)->nullable();
    $table->decimal('longitude', 11, 8)->nullable();
    $table->json('business_hours')->nullable();
    $table->boolean('is_active')->default(false); // Admin approval needed
    $table->boolean('is_verified')->default(false);
    $table->timestamps();

    $table->index(['latitude', 'longitude']);
});
```

### medicine_stocks_table.php:
```php
Schema::create('medicine_stocks', function (Blueprint $table) {
    $table->id();
    $table->foreignId('medicine_id')->constrained();
    $table->foreignId('pharmacy_id')->constrained();
    $table->integer('quantity')->default(0);
    $table->decimal('purchase_price', 10, 2);
    $table->decimal('selling_price', 10, 2);
    $table->string('batch_no')->nullable();
    $table->date('expiry_date')->nullable();
    $table->integer('low_stock_threshold')->default(10);
    $table->timestamps();

    $table->unique(['medicine_id', 'pharmacy_id', 'batch_no']);
});
```

### orders_table.php:
```php
Schema::create('orders', function (Blueprint $table) {
    $table->id();
    $table->string('order_number')->unique();
    $table->foreignId('pharmacy_id')->constrained();
    $table->foreignId('customer_id')->nullable()->constrained('users');
    $table->enum('order_type', ['online', 'pos']);
    $table->enum('status', [
        'pending', 'confirmed', 'preparing',
        'ready_for_pickup', 'out_for_delivery',
        'delivered', 'cancelled'
    ])->default('pending');
    $table->decimal('subtotal', 10, 2);
    $table->decimal('discount', 10, 2)->default(0);
    $table->decimal('tax', 10, 2)->default(0);
    $table->decimal('total', 10, 2);
    $table->enum('payment_method', ['cash', 'card', 'mobile', 'stripe']);
    $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded']);
    $table->string('stripe_payment_id')->nullable();
    $table->json('shipping_address')->nullable();
    $table->text('notes')->nullable();
    $table->timestamps();
});
```

## 1.4 Multi-Tenancy Middleware

### ResolvePharmacy.php:
```php
<?php

namespace App\Http\Middleware;

use App\Models\Pharmacy;
use Closure;
use Illuminate\Http\Request;

class ResolvePharmacy
{
    public function handle(Request $request, Closure $next)
    {
        $host = $request->getHost();
        $domain = config('services.platform.domain');

        // Check if accessing via subdomain
        if (str_ends_with($host, '.' . $domain)) {
            $subdomain = explode('.', $host)[0];

            $pharmacy = Pharmacy::where('subdomain', $subdomain)
                ->where('is_active', true)
                ->first();

            if (!$pharmacy) {
                abort(404, 'Pharmacy not found or inactive.');
            }

            // Set current pharmacy in app
            app()->instance('current_pharmacy', $pharmacy);

            // Share with all views
            view()->share('current_pharmacy', $pharmacy);
        }

        return $next($request);
    }
}
```

### BelongsToPharmacy Trait:
```php
<?php

namespace App\Models\Traits;

use App\Models\Pharmacy;

trait BelongsToPharmacy
{
    public function bootBelongsToPharmacy()
    {
        // Auto-filter by current pharmacy when resolving
        static::addGlobalScope('pharmacy', function ($query) {
            if (app()->has('current_pharmacy')) {
                $query->where('pharmacy_id', app('current_pharmacy')->id);
            }
        });

        // Auto-set pharmacy_id on creating
        static::creating(function ($model) {
            if (app()->has('current_pharmacy') && empty($model->pharmacy_id)) {
                $model->pharmacy_id = app('current_pharmacy')->id;
            }
        });
    }

    public function pharmacy()
    {
        return $this->belongsTo(Pharmacy::class);
    }
}
```

## 1.5 Key Files to Create
- [ ] `.env` configuration
- [ ] `config/tenancy.php` - Multi-tenancy config
- [ ] `app/Http/Kernel.php` - Register middleware
- [ ] All database migrations
- [ ] Base models with traits

## 1.6 Deliverables
- ✅ Laravel project with proper structure
- ✅ React project with Vite + TailwindCSS
- ✅ Complete database schema
- ✅ Multi-tenancy middleware working
- ✅ Basic folder organization

---

# 📋 PHASE 2: Authentication & Multi-tenancy (Week 3-4)

## Objective
Build complete authentication system with role-based access control for all user types.

## 2.1 Backend Auth Implementation

### Install & Configure Sanctum:
```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

### User Model Updates:
```php
// app/Models/User.php
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasRoles, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'role',
        'pharmacy_id', 'phone', 'avatar', 'is_active'
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function pharmacy()
    {
        return $this->belongsTo(Pharmacy::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'customer_id');
    }
}
```

### Auth Controller:
```php
// app/Http/Controllers/Api/Auth/AuthController.php
class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:pharmacy_owner,customer',
        ]);

        $user = User::create([
            ...$validated,
            'password' => Hash::make($validated['password']),
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'subdomain' => 'nullable|string' // For pharmacy login
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        $user = Auth::user();

        // If subdomain provided, verify user belongs to that pharmacy
        if (!empty($credentials['subdomain'])) {
            $pharmacy = Pharmacy::where('subdomain', $credentials['subdomain'])->first();
            if (!$pharmacy || $user->pharmacy_id !== $pharmacy->id) {
                return response()->json([
                    'message' => 'Unauthorized for this pharmacy'
                ], 403);
            }
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'pharmacy' => $user->pharmacy
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()->load('pharmacy'),
        ]);
    }
}
```

### Routes (api.php):
```php
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Super Admin Routes
    Route::prefix('super-admin')->middleware('role:super_admin')->group(function () {
        Route::apiResource('pharmacies', SuperAdmin\PharmacyController::class);
        Route::apiResource('medicines', SuperAdmin\MedicineController::class);
        Route::post('/supply-orders', [SupplyController::class, 'store']);
        Route::get('/reports/{type}', [ReportController::class, 'index']);
    });

    // Pharmacy Owner Routes
    Route::prefix('pharmacy')->middleware('role:pharmacy_owner|pharmacy_staff')->group(function () {
        Route::get('/dashboard', [Pharmacy\DashboardController::class, 'index']);
        Route::apiResource('medicines', Pharmacy\MedicineController::class);
        Route::apiResource('stock', Pharmacy\StockController::class);
        Route::apiResource('orders', Pharmacy\OrderController::class);
        Route::post('/pos/sale', [POSController::class, 'store']);
        Route::get('/settings', [SettingController::class, 'index']);
        Route::put('/settings', [SettingController::class, 'update']);
    });
});

// Public Routes (for customer-facing ecommerce)
Route::prefix('customer')->group(function () {
    Route::get('/medicines/search', [Customer\SearchController::class, 'search']);
    Route::get('/medicines/{medicine}', [Customer\MedicineController::class, 'show']);
    Route::post('/orders', [Customer\OrderController::class, 'store']);
});
```

## 2.2 Frontend Auth Implementation

### Auth Store (Zustand):
```javascript
// src/shared/store/authStore.js
import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    isLoading: true,

    initialize: async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await api.get('/auth/me');
                set({ user: response.data.user, isLoading: false });
            } catch {
                localStorage.removeItem('token');
                set({ user: null, token: null, isLoading: false });
            }
        } else {
            set({ isLoading: false });
        }
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        const { user, token } = response.data;
        localStorage.setItem('token', token);
        set({ user, token });
        return user;
    },

    register: async (data) => {
        const response = await api.post('/auth/register', data);
        const { user, token } = response.data;
        localStorage.setItem('token', token);
        set({ user, token });
        return user;
    },

    logout: async () => {
        await api.post('/auth/logout');
        localStorage.removeItem('token');
        set({ user: null, token: null });
    }
}));

export default useAuthStore;
```

### Protected Route Component:
```jsx
// src/shared/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export function ProtectedRoute({ children, allowedRoles }) {
    const { user, isLoading } = useAuthStore();

    if (isLoading) return <LoadingSpinner />;

    if (!user) return <Navigate to="/login" />;

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
}
```

### Login Page:
```jsx
// src/apps/customer/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../shared/store/authStore';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login({ email, password });
            // Redirect based on role
            switch (user.role) {
                case 'super_admin':
                    navigate('/admin/dashboard');
                    break;
                case 'pharmacy_owner':
                    navigate('/pharmacy/dashboard');
                    break;
                default:
                    navigate('/');
            }
        } catch (error) {
            toast.error('Login failed');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Form fields */}
        </form>
    );
}
```

## 2.3 Pharmacy Owner Onboarding

### Pharmacy Registration Flow:
1. Owner registers with email/password
2. Fills pharmacy details (name, license, address, location)
3. System generates subdomain (e.g., "health-plus" → health-plus.yourplatform.com)
4. Admin receives notification for approval
5. Upon approval, owner receives welcome email
6. Owner can then login to their dashboard

### Pharmacy Registration Controller:
```php
// app/Http/Controllers/Api/Pharmacy/RegistrationController.php
class RegistrationController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'license_no' => 'required|string|unique:pharmacies',
            'phone' => 'required|string',
            'email' => 'required|email',
            'address' => 'required|string',
            'city' => 'required|string',
            'state' => 'required|string',
            'zip_code' => 'required|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        // Generate subdomain from name
        $subdomain = Str::slug($validated['name']);

        // Check uniqueness
        while (Pharmacy::where('subdomain', $subdomain)->exists()) {
            $subdomain = Str::slug($validated['name']) . '-' . Str::random(3);
        }

        $pharmacy = Auth::user()->pharmacy()->create([
            ...$validated,
            'slug' => Str::slug($validated['name']),
            'subdomain' => $subdomain,
            'is_active' => false, // Pending approval
        ]);

        // Notify admin
        NotifyAdminNewPharmacy::dispatch($pharmacy);

        return response()->json([
            'pharmacy' => $pharmacy,
            'message' => 'Registration submitted. Pending admin approval.'
        ], 201);
    }
}
```

## 2.4 Key Files to Create
- [ ] Auth controllers and routes
- [ ] Sanctum configuration
- [ ] Role seeder (super_admin, pharmacy_owner, pharmacy_staff, customer)
- [ ] Frontend auth pages (Login, Register)
- [ ] Auth store and hooks
- [ ] Protected route components
- [ ] Pharmacy registration flow

## 2.5 Deliverables
- ✅ Complete auth system with Sanctum
- ✅ Role-based access control
- ✅ Login/Register pages
- ✅ Pharmacy owner onboarding
- ✅ Admin approval workflow

---

# 📋 PHASE 3: Super Admin Panel (Week 5-7)

## Objective
Build the super admin dashboard and the public-facing medicine search website.

## 3.1 Public Search Website (yourplatform.com)

### Homepage:
```jsx
// src/apps/customer/pages/Home.jsx
export default function Home() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">
                        Find Medicines Near You
                    </h1>
                    <p className="text-xl mb-8">
                        Search from hundreds of pharmacies
                    </p>
                    <SearchBar large />
                </div>
            </section>

            {/* Featured Pharmacies */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-6">Featured Pharmacies</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {pharmacies.map(pharmacy => (
                            <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Categories */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {categories.map(category => (
                            <CategoryCard key={category.id} category={category} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
```

### Search Results with Map:
```jsx
// src/apps/customer/pages/Search.jsx
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useSearchParams } from 'react-router-dom';
import api from '../../../shared/services/api';

export default function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState([]);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
    const [filters, setFilters] = useState({
        radius: 10, // km
        inStock: true,
        sortBy: 'relevance'
    });

    useEffect(() => {
        searchMedicines();
    }, [query, filters]);

    const searchMedicines = async () => {
        const response = await api.get('/customer/medicines/search', {
            params: { q: query, ...filters }
        });
        setResults(response.data.results);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Search Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">
                        Search results for "{query}"
                    </h1>
                    <p className="text-gray-600">
                        Found in {results.length} pharmacies
                    </p>
                </div>

                {/* View Toggle */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded ${viewMode === 'list' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                    >
                        <ListIcon />
                    </button>
                    <button
                        onClick={() => setViewMode('map')}
                        className={`p-2 rounded ${viewMode === 'map' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                    >
                        <MapIcon />
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="flex flex-wrap gap-4">
                    <select
                        value={filters.radius}
                        onChange={(e) => setFilters({...filters, radius: e.target.value})}
                        className="border rounded px-3 py-2"
                    >
                        <option value="5">Within 5 km</option>
                        <option value="10">Within 10 km</option>
                        <option value="25">Within 25 km</option>
                        <option value="50">Within 50 km</option>
                    </select>

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={filters.inStock}
                            onChange={(e) => setFilters({...filters, inStock: e.target.checked})}
                        />
                        In Stock Only
                    </label>

                    <select
                        value={filters.sortBy}
                        onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                        className="border rounded px-3 py-2"
                    >
                        <option value="relevance">Relevance</option>
                        <option value="price_low">Price: Low to High</option>
                        <option value="price_high">Price: High to Low</option>
                        <option value="distance">Distance</option>
                        <option value="rating">Rating</option>
                    </select>
                </div>
            </div>

            {/* Results */}
            {viewMode === 'list' ? (
                <div className="space-y-4">
                    {results.map(result => (
                        <PharmacyResultCard
                            key={result.pharmacy.id}
                            result={result}
                        />
                    ))}
                </div>
            ) : (
                <div className="h-[600px] rounded-lg overflow-hidden">
                    <MapContainer
                        center={[userLat, userLng]}
                        zoom={12}
                        className="h-full w-full"
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {results.map(result => (
                            <Marker
                                key={result.pharmacy.id}
                                position={[
                                    result.pharmacy.latitude,
                                    result.pharmacy.longitude
                                ]}
                            >
                                <Popup>
                                    <div className="p-2">
                                        <h3 className="font-bold">{result.pharmacy.name}</h3>
                                        <p className="text-sm text-gray-600">
                                            {result.medicines.length} medicines available
                                        </p>
                                        <p className="text-green-600 font-semibold">
                                            From ${result最低价}
                                        </p>
                                        <a
                                            href={`https://${result.pharmacy.subdomain}.yourplatform.com`}
                                            className="block mt-2 text-center bg-green-600 text-white py-1 rounded"
                                        >
                                            Visit Store
                                        </a>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            )}
        </div>
    );
}
```

### Search Controller:
```php
// app/Http/Controllers/Api/Customer/SearchController.php
class SearchController extends Controller
{
    public function search(Request $request)
    {
        $validated = $request->validate([
            'q' => 'required|string|min:2',
            'radius' => 'nullable|numeric|min:1|max:100',
            'inStock' => 'nullable|boolean',
            'sortBy' => 'nullable|in:relevance,price_low,price_high,distance,rating',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $query = Medicine::query()
            ->where('name', 'LIKE', "%{$validated['q']}%")
            ->orWhere('generic_name', 'LIKE', "%{$validated['q']}%");

        // Get pharmacies with this medicine in stock
        $results = $query->with(['stocks' => function ($q) use ($validated) {
            $q->where('quantity', '>', 0)
              ->with('pharmacy');

            if (!empty($validated['inStock']) && $validated['inStock']) {
                $q->where('quantity', '>', 0);
            }
        }])->get();

        // Group by pharmacy and calculate prices
        $groupedResults = $results->flatMap(function ($medicine) {
            return $medicine->stocks->map(function ($stock) use ($medicine) {
                return [
                    'pharmacy' => $stock->pharmacy,
                    'medicine' => $medicine,
                    'price' => $stock->selling_price,
                    'in_stock' => $stock->quantity > 0,
                ];
            });
        })->groupBy('pharmacy.id');

        // Sort results
        // ... sorting logic based on sortBy parameter

        return response()->json([
            'results' => $groupedResults,
            'total' => $groupedResults->count()
        ]);
    }
}
```

## 3.2 Super Admin Dashboard

### Dashboard Page:
```jsx
// src/apps/superadmin/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col, Table, Chart } from 'antd';
import {
    PharmacyIcon,
    MedicineIcon,
    OrderIcon,
    RevenueIcon
} from '../components/icons';
import api from '../../../shared/services/api';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [recentPharmacies, setRecentPharmacies] = useState([]);
    const [lowStockAlerts, setLowStockAlerts] = useState([]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        const response = await api.get('/super-admin/dashboard');
        setStats(response.data.stats);
        setRecentPharmacies(response.data.recentPharmacies);
        setLowStockAlerts(response.data.lowStockAlerts);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Super Admin Dashboard</h1>

            {/* Stats Cards */}
            <Row gutter={16} className="mb-6">
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Pharmacies"
                            value={stats?.totalPharmacies}
                            prefix={<PharmacyIcon />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Active Pharmacies"
                            value={stats?.activePharmacies}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Orders"
                            value={stats?.totalOrders}
                            prefix={<OrderIcon />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Revenue"
                            value={stats?.totalRevenue}
                            precision={2}
                            prefix="$"
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Recent Pharmacies & Low Stock Alerts */}
            <Row gutter={16}>
                <Col span={12}>
                    <Card title="Recent Registrations">
                        <Table
                            dataSource={recentPharmacies}
                            columns={[
                                { title: 'Name', dataIndex: 'name' },
                                { title: 'City', dataIndex: 'city' },
                                { title: 'Status', dataIndex: 'status' },
                                { title: 'Actions', render: () => <Button>View</Button> }
                            ]}
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Low Stock Alerts">
                        <Table
                            dataSource={lowStockAlerts}
                            columns={[
                                { title: 'Pharmacy', dataIndex: ['pharmacy', 'name'] },
                                { title: 'Medicine', dataIndex: ['medicine', 'name'] },
                                { title: 'Stock', dataIndex: 'quantity' },
                                { title: 'Action', render: () => <Button>Supply</Button> }
                            ]}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
```

### Pharmacy Management:
```jsx
// src/apps/superadmin/pages/Pharmacies/Index.jsx
export default function PharmaciesIndex() {
    const [pharmacies, setPharmacies] = useState([]);
    const [filters, setFilters] = useState({
        status: 'all',
        search: '',
        page: 1
    });

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Pharmacies</h1>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Search pharmacies..."
                        className="border rounded px-4 py-2"
                        onChange={(e) => setFilters({...filters, search: e.target.value})}
                    />
                    <select
                        className="border rounded px-4 py-2"
                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left">Name</th>
                            <th className="px-6 py-3 text-left">Owner</th>
                            <th className="px-6 py-3 text-left">City</th>
                            <th className="px-6 py-3 text-left">Status</th>
                            <th className="px-6 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pharmacies.map(pharmacy => (
                            <tr key={pharmacy.id} className="border-t">
                                <td className="px-6 py-4">{pharmacy.name}</td>
                                <td className="px-6 py-4">{pharmacy.owner.name}</td>
                                <td className="px-6 py-4">{pharmacy.city}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        pharmacy.is_active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {pharmacy.is_active ? 'Active' : 'Pending'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-blue-600 hover:underline mr-3">View</button>
                                    <button className="text-green-600 hover:underline mr-3">
                                        {pharmacy.is_active ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button className="text-gray-600 hover:underline">Contact</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
```

## 3.3 Deliverables
- ✅ Public search website with map
- ✅ Medicine search across pharmacies
- ✅ Super admin dashboard with stats
- ✅ Pharmacy management (CRUD)
- ✅ Pharmacy approval workflow

---

# 📋 PHASE 4: Pharmacy Management System & POS (Week 8-11)

## Objective
Build the pharmacy owner's complete management system including POS.

## 4.1 Pharmacy Dashboard

```jsx
// src/apps/pharmacy/pages/Dashboard.jsx
export default function PharmacyDashboard() {
    const [stats, setStats] = useState({
        todaySales: 0,
        todayOrders: 0,
        lowStockItems: 0,
        pendingOrders: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Pharmacy Dashboard</h1>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-6 mb-6">
                <StatCard
                    title="Today's Sales"
                    value={`$${stats.todaySales}`}
                    icon={<DollarIcon />}
                    color="green"
                />
                <StatCard
                    title="Today's Orders"
                    value={stats.todayOrders}
                    icon={<OrderIcon />}
                    color="blue"
                />
                <StatCard
                    title="Low Stock Items"
                    value={stats.lowStockItems}
                    icon={<AlertIcon />}
                    color="yellow"
                />
                <StatCard
                    title="Pending Orders"
                    value={stats.pendingOrders}
                    icon={<ClockIcon />}
                    color="red"
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <QuickAction
                    title="New POS Sale"
                    icon={<CashIcon />}
                    href="/pharmacy/pos"
                />
                <QuickAction
                    title="Add Medicine"
                    icon={<PlusIcon />}
                    href="/pharmacy/medicines/create"
                />
                <QuickAction
                    title="View Orders"
                    icon={<OrderIcon />}
                    href="/pharmacy/orders"
                />
                <QuickAction
                    title="Stock Report"
                    icon={<ReportIcon />}
                    href="/pharmacy/stock"
                />
            </div>

            {/* Recent Orders & Low Stock Alerts */}
            <div className="grid grid-cols-2 gap-6">
                <Card title="Recent Orders">
                    <OrderList orders={recentOrders} />
                </Card>
                <Card title="Low Stock Alerts">
                    <LowStockList />
                </Card>
            </div>
        </div>
    );
}
```

## 4.2 Medicine Management

```jsx
// src/apps/pharmacy/pages/Medicines/Index.jsx
export default function MedicinesIndex() {
    const [medicines, setMedicines] = useState([]);
    const [categories, setCategories] = useState([]);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Medicines</h1>
                <div className="flex gap-4">
                    <button className="bg-gray-600 text-white px-4 py-2 rounded">
                        Import CSV
                    </button>
                    <button className="bg-green-600 text-white px-4 py-2 rounded">
                        Add Medicine
                    </button>
                </div>
            </div>

            <MedicineTable medicines={medicines} />
        </div>
    );
}

// Medicine Form
export function MedicineForm() {
    const [formData, setFormData] = useState({
        name: '',
        generic_name: '',
        brand: '',
        category_id: '',
        description: '',
        unit_price: '',
        requires_prescription: false,
        image: null
    });

    return (
        <form className="max-w-2xl mx-auto">
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Medicine Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <Input
                    label="Generic Name"
                    value={formData.generic_name}
                    onChange={(e) => setFormData({...formData, generic_name: e.target.value})}
                />
                <Input
                    label="Brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                />
                <Select
                    label="Category"
                    options={categories}
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                />
                <Input
                    label="Unit Price"
                    type="number"
                    value={formData.unit_price}
                    onChange={(e) => setFormData({...formData, unit_price: e.target.value})}
                />
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={formData.requires_prescription}
                        onChange={(e) => setFormData({...formData, requires_prescription: e.target.checked})}
                    />
                    <label>Requires Prescription</label>
                </div>
                <div className="col-span-2">
                    <label className="block mb-2">Description</label>
                    <textarea
                        className="w-full border rounded px-3 py-2"
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                </div>
                <div className="col-span-2">
                    <label className="block mb-2">Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                    />
                </div>
            </div>
            <button type="submit" className="mt-4 bg-green-600 text-white px-6 py-2 rounded">
                Save Medicine
            </button>
        </form>
    );
}
```

## 4.3 POS System

```jsx
// src/apps/pos/pages/POS.jsx
import { useState, useEffect, useRef } from 'react';
import useCartStore from '../store/cartStore';
import { Search, ShoppingCart, CreditCard, Banknote } from 'lucide-react';

export default function POS() {
    const [searchQuery, setSearchQuery] = useState('');
    const [medicines, setMedicines] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const { items, total, addItem, removeItem, updateQuantity, clearCart } = useCartStore();
    const searchInputRef = useRef(null);

    useEffect(() => {
        // Focus search on mount
        searchInputRef.current?.focus();
        // Load medicines
        loadMedicines();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        const results = await searchMedicines(searchQuery);
        setMedicines(results);
    };

    const handleCompleteSale = async () => {
        if (items.length === 0) return;

        try {
            await api.post('/pharmacy/pos/sale', {
                items: items.map(item => ({
                    medicine_id: item.id,
                    quantity: item.quantity
                })),
                payment_method: paymentMethod,
                total: total
            });

            // Print receipt
            printReceipt();

            // Clear cart
            clearCart();

            toast.success('Sale completed!');
        } catch (error) {
            toast.error('Failed to complete sale');
        }
    };

    return (
        <div className="h-screen flex bg-gray-100">
            {/* Left: Products */}
            <div className="flex-1 flex flex-col">
                {/* Search Bar */}
                <div className="p-4 bg-white shadow">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search medicine or scan barcode..."
                            className="flex-1 text-lg p-3 border-2 rounded"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="bg-green-600 text-white px-6 rounded">
                            <Search size={24} />
                        </button>
                    </form>
                </div>

                {/* Product Grid */}
                <div className="flex-1 overflow-auto p-4">
                    <div className="grid grid-cols-4 gap-4">
                        {medicines.map(medicine => (
                            <div
                                key={medicine.id}
                                className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg"
                                onClick={() => addItem(medicine)}
                            >
                                <div className="text-sm text-gray-500">{medicine.brand}</div>
                                <div className="font-semibold">{medicine.name}</div>
                                <div className="text-green-600 font-bold mt-2">
                                    ${medicine.pivot?.selling_price || medicine.unit_price}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Stock: {medicine.pivot?.quantity || 0}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Cart */}
            <div className="w-96 bg-white shadow-lg flex flex-col">
                {/* Cart Header */}
                <div className="p-4 border-b flex items-center gap-2">
                    <ShoppingCart size={24} />
                    <h2 className="text-xl font-bold">Cart ({items.length})</h2>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-auto p-4">
                    {items.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            Cart is empty
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between items-center border-b pb-2">
                                    <div className="flex-1">
                                        <div className="font-semibold">{item.name}</div>
                                        <div className="text-sm text-gray-500">
                                            ${item.price} x {item.quantity}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="w-8 h-8 bg-gray-200 rounded"
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center">{item.quantity}</span>
                                        <button
                                            className="w-8 h-8 bg-gray-200 rounded"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                        <button
                                            className="w-8 h-8 bg-red-500 text-white rounded"
                                            onClick={() => removeItem(item.id)}
                                        >
                                            x
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Cart Summary */}
                <div className="border-t p-4">
                    <div className="flex justify-between text-lg mb-2">
                        <span>Subtotal:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg mb-4">
                        <span>Tax (10%):</span>
                        <span>${(total * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-2xl font-bold mb-4">
                        <span>Total:</span>
                        <span>${(total * 1.1).toFixed(2)}</span>
                    </div>

                    {/* Payment Methods */}
                    <div className="flex gap-2 mb-4">
                        <button
                            className={`flex-1 p-3 rounded flex items-center justify-center gap-2 ${
                                paymentMethod === 'cash' ? 'bg-green-600 text-white' : 'bg-gray-200'
                            }`}
                            onClick={() => setPaymentMethod('cash')}
                        >
                            <Banknote size={20} />
                            Cash
                        </button>
                        <button
                            className={`flex-1 p-3 rounded flex items-center justify-center gap-2 ${
                                paymentMethod === 'card' ? 'bg-green-600 text-white' : 'bg-gray-200'
                            }`}
                            onClick={() => setPaymentMethod('card')}
                        >
                            <CreditCard size={20} />
                            Card
                        </button>
                        <button
                            className={`flex-1 p-3 rounded flex items-center justify-center gap-2 ${
                                paymentMethod === 'mobile' ? 'bg-green-600 text-white' : 'bg-gray-200'
                            }`}
                            onClick={() => setPaymentMethod('mobile')}
                        >
                            <Smartphone size={20} />
                            Mobile
                        </button>
                    </div>

                    <button
                        className="w-full bg-green-600 text-white py-4 rounded-lg text-xl font-bold"
                        onClick={handleCompleteSale}
                    >
                        Complete Sale
                    </button>
                </div>
            </div>
        </div>
    );
}
```

## 4.4 Stock Management

```jsx
// src/apps/pharmacy/pages/Stock/Index.jsx
export default function StockIndex() {
    const [stocks, setStocks] = useState([]);
    const [lowStockItems, setLowStockItems] = useState([]);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Stock Management</h1>
                <button className="bg-green-600 text-white px-4 py-2 rounded">
                    Add Stock
                </button>
            </div>

            {/* Low Stock Alert Banner */}
            {lowStockItems.length > 0 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex">
                        <AlertIcon className="text-yellow-400" />
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                {lowStockItems.length} items are below minimum stock level
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <StockTable stocks={stocks} />
        </div>
    );
}
```

## 4.5 Order Management

```jsx
// src/apps/pharmacy/pages/Orders/Index.jsx
export default function OrdersIndex() {
    const [orders, setOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        preparing: 'bg-purple-100 text-purple-800',
        ready_for_pickup: 'bg-green-100 text-green-800',
        out_for_delivery: 'bg-indigo-100 text-indigo-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800'
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Orders</h1>
                <select
                    className="border rounded px-4 py-2"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="delivered">Delivered</option>
                </select>
            </div>

            <div className="bg-white rounded-lg shadow">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left">Order #</th>
                            <th className="px-6 py-3 text-left">Customer</th>
                            <th className="px-6 py-3 text-left">Items</th>
                            <th className="px-6 py-3 text-left">Total</th>
                            <th className="px-6 py-3 text-left">Status</th>
                            <th className="px-6 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className="border-t">
                                <td className="px-6 py-4 font-mono">{order.order_number}</td>
                                <td className="px-6 py-4">{order.customer?.name || 'Guest'}</td>
                                <td className="px-6 py-4">{order.items.length} items</td>
                                <td className="px-6 py-4 font-semibold">${order.total}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${statusColors[order.status]}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <select
                                        className="border rounded px-2 py-1"
                                        value={order.status}
                                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirm</option>
                                        <option value="preparing">Preparing</option>
                                        <option value="ready_for_pickup">Ready</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancel</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
```

## 4.6 Deliverables
- ✅ Pharmacy owner dashboard
- ✅ Medicine CRUD management
- ✅ Stock management with low-stock alerts
- ✅ POS system with cart and checkout
- ✅ Order management with status workflow

---

# 📋 PHASE 5: E-commerce & Customer Features (Week 12-15)

## Objective
Build the e-commerce storefront for each pharmacy and customer features.

## 5.1 Pharmacy E-commerce Store

### Store Homepage:
```jsx
// src/apps/customer/pages/Store/Home.jsx
export default function StoreHome() {
    const pharmacy = usePharmacy(); // From subdomain context

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Pharmacy Header */}
            <header className="bg-white shadow">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <img src={pharmacy.logo} className="w-16 h-16 rounded" />
                        <div>
                            <h1 className="text-2xl font-bold">{pharmacy.name}</h1>
                            <p className="text-gray-600">{pharmacy.address}</p>
                        </div>
                        <div className="ml-auto flex items-center gap-4">
                            <span className="text-sm text-gray-500">
                                {pharmacy.is_open ? 'Open Now' : 'Closed'}
                            </span>
                            <button className="text-green-600">
                                <PhoneIcon /> Call
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Search & Categories */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <SearchBar placeholder={`Search in ${pharmacy.name}...`} />
                    <CategoryTabs categories={pharmacy.categories} />
                </div>
            </div>

            {/* Featured Medicines */}
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-xl font-bold mb-4">Featured Medicines</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {featuredMedicines.map(medicine => (
                        <MedicineCard key={medicine.id} medicine={medicine} />
                    ))}
                </div>
            </div>

            {/* All Medicines */}
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-xl font-bold mb-4">All Medicines</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {medicines.map(medicine => (
                        <MedicineCard key={medicine.id} medicine={medicine} />
                    ))}
                </div>
            </div>
        </div>
    );
}
```

### Medicine Card Component:
```jsx
// src/apps/customer/components/MedicineCard.jsx
export default function MedicineCard({ medicine }) {
    const { addItem } = useCartStore();

    return (
        <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <img
                src={medicine.image || '/placeholder-medicine.png'}
                alt={medicine.name}
                className="w-full h-40 object-cover rounded-t-lg"
            />
            <div className="p-4">
                <div className="text-sm text-gray-500">{medicine.brand}</div>
                <h3 className="font-semibold text-lg">{medicine.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{medicine.generic_name}</p>
                <div className="flex justify-between items-center mt-4">
                    <span className="text-green-600 font-bold text-xl">
                        ${medicine.pivot?.selling_price || medicine.unit_price}
                    </span>
                    {medicine.requires_prescription && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                            Rx Only
                        </span>
                    )}
                </div>
                <div className="mt-2 text-sm text-gray-500">
                    Stock: {medicine.pivot?.quantity || 0} available
                </div>
                <button
                    className="w-full mt-4 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                    onClick={() => addItem(medicine)}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}
```

## 5.2 Shopping Cart & Checkout

### Cart Page:
```jsx
// src/apps/customer/pages/Cart.jsx
export default function Cart() {
    const { items, total, removeItem, updateQuantity, clearCart } = useCartStore();
    const navigate = useNavigate();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

            {items.length === 0 ? (
                <div className="text-center py-12">
                    <ShoppingCartIcon size={64} className="mx-auto text-gray-400" />
                    <p className="text-gray-500 mt-4">Your cart is empty</p>
                    <button
                        className="mt-4 bg-green-600 text-white px-6 py-2 rounded"
                        onClick={() => navigate('/medicines')}
                    >
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="col-span-2">
                        <div className="bg-white rounded-lg shadow">
                            {items.map(item => (
                                <div key={item.id} className="flex items-center gap-4 p-4 border-b">
                                    <img src={item.image} className="w-20 h-20 rounded" />
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{item.name}</h3>
                                        <p className="text-gray-500">{item.brand}</p>
                                        <p className="text-green-600 font-bold">${item.price}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="w-8 h-8 bg-gray-200 rounded"
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center">{item.quantity}</span>
                                        <button
                                            className="w-8 h-8 bg-gray-200 rounded"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                                        <button
                                            className="text-red-500 text-sm"
                                            onClick={() => removeItem(item.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white rounded-lg shadow p-6 h-fit">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery Fee</span>
                                <span>$5.00</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax (10%)</span>
                                <span>${(total * 0.1).toFixed(2)}</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${(total + 5 + total * 0.1).toFixed(2)}</span>
                            </div>
                        </div>
                        <button
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold"
                            onClick={() => navigate('/checkout')}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
```

### Checkout Page with Stripe:
```jsx
// src/apps/customer/pages/Checkout.jsx
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('your_stripe_publishable_key');

function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentMethod, setPaymentMethod] = useState('stripe');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (paymentMethod === 'cod') {
            // Place order with COD
            await placeOrder({ payment_method: 'cod' });
        } else {
            // Stripe payment
            const { error, paymentIntent } = await stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: {
                        card: elements.getElement(CardElement),
                    },
                }
            );

            if (error) {
                toast.error(error.message);
            } else if (paymentIntent.status === 'succeeded') {
                await placeOrder({
                    payment_method: 'stripe',
                    stripe_payment_id: paymentIntent.id
                });
            }
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Full Name" required />
                    <Input label="Phone" required />
                    <Input label="Address" className="col-span-2" required />
                    <Input label="City" required />
                    <Input label="ZIP Code" required />
                </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                <div className="flex gap-4 mb-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="payment"
                            value="stripe"
                            checked={paymentMethod === 'stripe'}
                            onChange={() => setPaymentMethod('stripe')}
                        />
                        Credit/Debit Card
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="payment"
                            value="cod"
                            checked={paymentMethod === 'cod'}
                            onChange={() => setPaymentMethod('cod')}
                        />
                        Cash on Delivery
                    </label>
                </div>

                {paymentMethod === 'stripe' && (
                    <div className="border rounded p-4">
                        <CardElement />
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-4 rounded-lg text-xl font-bold"
            >
                {loading ? 'Processing...' : 'Place Order'}
            </button>
        </form>
    );
}

export default function Checkout() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>
            <Elements stripe={stripePromise}>
                <CheckoutForm />
            </Elements>
        </div>
    );
}
```

## 5.3 Customer Order History

```jsx
// src/apps/customer/pages/Orders/History.jsx
export default function OrderHistory() {
    const [orders, setOrders] = useState([]);

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        preparing: 'bg-purple-100 text-purple-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800'
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">My Orders</h1>

            <div className="space-y-4">
                {orders.map(order => (
                    <div key={order.id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="text-sm text-gray-500">Order #{order.order_number}</div>
                                <div className="text-sm text-gray-500">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm ${statusColors[order.status]}`}>
                                {order.status}
                            </span>
                        </div>

                        <div className="border-t pt-4">
                            {order.items.map(item => (
                                <div key={item.id} className="flex items-center gap-4 mb-2">
                                    <img src={item.medicine.image} className="w-12 h-12 rounded" />
                                    <div className="flex-1">
                                        <div className="font-semibold">{item.medicine.name}</div>
                                        <div className="text-sm text-gray-500">
                                            {item.quantity} x ${item.unit_price}
                                        </div>
                                    </div>
                                    <div className="font-bold">${item.subtotal}</div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 mt-4 flex justify-between">
                            <span className="font-bold">Total: ${order.total}</span>
                            <div className="flex gap-2">
                                <button className="text-green-600 hover:underline">
                                    Track Order
                                </button>
                                <button className="text-blue-600 hover:underline">
                                    Reorder
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
```

## 5.4 Deliverables
- ✅ Pharmacy e-commerce storefront per subdomain
- ✅ Medicine browsing with categories
- ✅ Shopping cart functionality
- ✅ Checkout with Stripe + COD
- ✅ Customer order history
- ✅ Order tracking

---

# 📋 PHASE 6: Supply Chain & Reports (Week 16-17)

## Objective
Build the supply chain management system and reporting.

## 6.1 Low Stock Alert System

### MedicineStock Observer:
```php
// app/Observers/MedicineStockObserver.php
class MedicineStockObserver
{
    public function updated(MedicineStock $stock)
    {
        if ($stock->quantity <= $stock->low_stock_threshold) {
            // Notify pharmacy owner
            NotifyPharmacyLowStock::dispatch($stock);

            // Notify super admin
            NotifySuperAdminLowStock::dispatch($stock);
        }
    }
}
```

### Low Stock Alert Component:
```jsx
// src/apps/superadmin/components/LowStockAlerts.jsx
export default function LowStockAlerts() {
    const [alerts, setAlerts] = useState([]);

    return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
                <AlertIcon className="text-yellow-400" />
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                        Low Stock Alerts ({alerts.length})
                    </h3>
                    <div className="mt-2 space-y-2">
                        {alerts.map(alert => (
                            <div key={alert.id} className="flex justify-between items-center">
                                <div>
                                    <span className="font-semibold">{alert.pharmacy.name}</span>
                                    <span className="mx-2">-</span>
                                    <span>{alert.medicine.name}</span>
                                    <span className="text-red-600 ml-2">
                                        ({alert.quantity} left)
                                    </span>
                                </div>
                                <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                                    Create Supply Order
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
```

## 6.2 Supply Order Management

```jsx
// src/apps/superadmin/pages/Supply/Create.jsx
export default function CreateSupplyOrder() {
    const [pharmacy, setPharmacy] = useState(null);
    const [items, setItems] = useState([]);
    const [profitMargin, setProfitMargin] = useState(10);

    const handleAddItem = (medicine) => {
        setItems([...items, {
            medicine_id: medicine.id,
            medicine: medicine,
            quantity: 1,
            cost_price: medicine.cost_price,
            supply_price: medicine.cost_price * (1 + profitMargin / 100)
        }]);
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (item.supply_price * item.quantity), 0);
    };

    const handleCreateSupplyOrder = async () => {
        await api.post('/super-admin/supply-orders', {
            pharmacy_id: pharmacy.id,
            items: items.map(item => ({
                medicine_id: item.medicine_id,
                quantity: item.quantity,
                cost_price: item.cost_price,
                supply_price: item.supply_price
            })),
            profit_margin: profitMargin
        });

        toast.success('Supply order created!');
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Create Supply Order</h1>

            {/* Pharmacy Selection */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Select Pharmacy</h2>
                <PharmacySelect onSelect={setPharmacy} />
            </div>

            {/* Medicine Selection */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Add Medicines</h2>
                <MedicineSearch onSelect={handleAddItem} />

                <table className="w-full mt-4">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left">Medicine</th>
                            <th className="px-4 py-2 text-left">Quantity</th>
                            <th className="px-4 py-2 text-left">Cost Price</th>
                            <th className="px-4 py-2 text-left">Supply Price</th>
                            <th className="px-4 py-2 text-left">Total</th>
                            <th className="px-4 py-2 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index} className="border-t">
                                <td className="px-4 py-2">{item.medicine.name}</td>
                                <td className="px-4 py-2">
                                    <input
                                        type="number"
                                        className="w-20 border rounded px-2 py-1"
                                        value={item.quantity}
                                        onChange={(e) => {
                                            const newItems = [...items];
                                            newItems[index].quantity = parseInt(e.target.value);
                                            setItems(newItems);
                                        }}
                                    />
                                </td>
                                <td className="px-4 py-2">${item.cost_price}</td>
                                <td className="px-4 py-2">${item.supply_price}</td>
                                <td className="px-4 py-2 font-bold">
                                    ${(item.supply_price * item.quantity).toFixed(2)}
                                </td>
                                <td className="px-4 py-2">
                                    <button
                                        className="text-red-500"
                                        onClick={() => setItems(items.filter((_, i) => i !== index))}
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Profit Margin & Total */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <label className="font-semibold">Profit Margin (%):</label>
                        <input
                            type="number"
                            className="ml-2 w-20 border rounded px-2 py-1"
                            value={profitMargin}
                            onChange={(e) => setProfitMargin(parseInt(e.target.value))}
                        />
                    </div>
                    <div className="text-2xl font-bold">
                        Total: ${calculateTotal().toFixed(2)}
                    </div>
                </div>
                <button
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-bold"
                    onClick={handleCreateSupplyOrder}
                >
                    Create Supply Order
                </button>
            </div>
        </div>
    );
}
```

## 6.3 Reports Dashboard

```jsx
// src/apps/superadmin/pages/Reports/Index.jsx
import { useState, useEffect } from 'react';
import { LineChart, BarChart, PieChart } from 'recharts';
import api from '../../../shared/services/api';

export default function ReportsIndex() {
    const [reportType, setReportType] = useState('sales');
    const [dateRange, setDateRange] = useState('7days');
    const [data, setData] = useState(null);

    useEffect(() => {
        loadReport();
    }, [reportType, dateRange]);

    const loadReport = async () => {
        const response = await api.get(`/super-admin/reports/${reportType}`, {
            params: { range: dateRange }
        });
        setData(response.data);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Reports & Analytics</h1>
                <div className="flex gap-4">
                    <select
                        className="border rounded px-4 py-2"
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                    >
                        <option value="sales">Sales Report</option>
                        <option value="revenue">Revenue Report</option>
                        <option value="inventory">Inventory Report</option>
                        <option value="supply">Supply Chain Report</option>
                    </select>
                    <select
                        className="border rounded px-4 py-2"
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                    >
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="90days">Last 90 Days</option>
                        <option value="1year">Last Year</option>
                    </select>
                    <button className="bg-green-600 text-white px-4 py-2 rounded">
                        Export PDF
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-6 mb-6">
                <StatCard title="Total Sales" value={data?.totalSales} />
                <StatCard title="Revenue" value={`$${data?.revenue}`} />
                <StatCard title="Orders" value={data?.totalOrders} />
                <StatCard title="Profit" value={`$${data?.profit}`} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-semibold mb-4">Sales Trend</h3>
                    <LineChart data={data?.salesTrend}>
                        {/* Chart configuration */}
                    </LineChart>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-semibold mb-4">Top Pharmacies</h3>
                    <BarChart data={data?.topPharmacies}>
                        {/* Chart configuration */}
                    </BarChart>
                </div>
            </div>

            {/* Detailed Table */}
            <div className="bg-white rounded-lg shadow mt-6">
                <div className="p-4 border-b">
                    <h3 className="font-semibold">Detailed Report</h3>
                </div>
                <table className="w-full">
                    {/* Table content */}
                </table>
            </div>
        </div>
    );
}
```

## 6.4 Deliverables
- ✅ Low stock alert system
- ✅ Supply order management
- ✅ Profit margin tracking
- ✅ Sales & revenue reports
- ✅ Export functionality (PDF/CSV)

---

# 📋 PHASE 7: Testing & Deployment (Week 18-20)

## Objective
Test the entire system and deploy to production.

## 7.1 Testing

### Backend Tests:
```php
// tests/Feature/PharmacyTest.php
class PharmacyTest extends TestCase
{
    use RefreshDatabase;

    public function test_pharmacy_registration()
    {
        $user = User::factory()->create(['role' => 'pharmacy_owner']);

        $response = $this->actingAs($user)
            ->postJson('/api/pharmacy/register', [
                'name' => 'Health Plus Pharmacy',
                'license_no' => 'PH-12345',
                'phone' => '+1234567890',
                'email' => 'info@healthplus.com',
                'address' => '123 Main St',
                'city' => 'New York',
                'state' => 'NY',
                'zip_code' => '10001',
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('pharmacies', [
            'name' => 'Health Plus Pharmacy',
            'subdomain' => 'health-plus-pharmacy',
            'is_active' => false,
        ]);
    }

    public function test_medicine_search_across_pharmacies()
    {
        $pharmacy1 = Pharmacy::factory()->active()->create();
        $pharmacy2 = Pharmacy::factory()->active()->create();

        $medicine = Medicine::factory()->create(['name' => 'Paracetamol']);

        MedicineStock::factory()->create([
            'medicine_id' => $medicine->id,
            'pharmacy_id' => $pharmacy1->id,
            'quantity' => 50,
            'selling_price' => 5.00
        ]);

        $response = $this->getJson('/api/customer/medicines/search?q=paracetamol');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'results');
    }

    public function test_pos_sale()
    {
        $user = User::factory()->create(['role' => 'pharmacy_staff']);
        $pharmacy = Pharmacy::factory()->create(['id' => $user->pharmacy_id]);
        $medicine = Medicine::factory()->create();

        MedicineStock::factory()->create([
            'medicine_id' => $medicine->id,
            'pharmacy_id' => $pharmacy->id,
            'quantity' => 100,
            'selling_price' => 10.00
        ]);

        $response = $this->actingAs($user)
            ->postJson('/api/pharmacy/pos/sale', [
                'items' => [
                    ['medicine_id' => $medicine->id, 'quantity' => 2]
                ],
                'payment_method' => 'cash',
                'total' => 22.00
            ]);

        $response->assertStatus(201);

        // Check stock was reduced
        $this->assertDatabaseHas('medicine_stocks', [
            'medicine_id' => $medicine->id,
            'quantity' => 98
        ]);
    }
}
```

### Frontend Tests:
```javascript
// src/__tests__/POS.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import POS from '../apps/pos/pages/POS';

describe('POS System', () => {
    test('adds item to cart', () => {
        render(<POS />);

        const medicineCard = screen.getByText('Paracetamol');
        fireEvent.click(medicineCard);

        expect(screen.getByText('Cart (1)')).toBeInTheDocument();
    });

    test('calculates total correctly', () => {
        render(<POS />);

        // Add items
        fireEvent.click(screen.getByText('Paracetamol'));
        fireEvent.click(screen.getByText('Ibuprofen'));

        expect(screen.getByText('$15.00')).toBeInTheDocument(); // Total
    });
});
```

## 7.2 Deployment

### Docker Setup:
```yaml
# docker-compose.yml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./backend:/var/www/html
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - php
      - react

  php:
    build:
      context: .
      dockerfile: docker/php/Dockerfile
    volumes:
      - ./backend:/var/www/html
    depends_on:
      - mysql
      - redis

  react:
    build:
      context: .
      dockerfile: docker/react/Dockerfile
    volumes:
      - ./frontend:/app
      - /app/node_modules

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: pharmacy_platform
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

  queue:
    build:
      context: .
      dockerfile: docker/php/Dockerfile
    command: php artisan queue:work
    volumes:
      - ./backend:/var/www/html
    depends_on:
      - redis
      - mysql

volumes:
  mysql_data:
```

### Nginx Configuration:
```nginx
# nginx/conf.d/platform.conf
server {
    listen 80;
    server_name yourplatform.com *.yourplatform.com;

    # Redirect HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourplatform.com *.yourplatform.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    root /var/www/html/public;
    index index.php;

    # Main application
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # API routes
    location /api {
        rewrite ^/api/(.*)$ /api/$1 break;
        try_files $uri $uri/ /index.php?$query_string;
    }

    # PHP-FPM
    location ~ \.php$ {
        fastcgi_pass php:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### React Build Configuration:
```nginx
# nginx/conf.d/frontend.conf
server {
    listen 443 ssl http2;
    server_name *.yourplatform.com;

    # SPA routing for each subdomain
    location / {
        root /var/www/html/dist;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API calls to backend
    location /api {
        proxy_pass http://nginx:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Deployment Commands:
```bash
# Build and start containers
docker-compose up -d --build

# Run migrations
docker-compose exec php php artisan migrate --force

# Seed database
docker-compose exec php php artisan db:seed

# Generate application key
docker-compose exec php php artisan key:generate

# Link storage
docker-compose exec php php artisan storage:link

# Cache config
docker-compose exec php php artisan config:cache
docker-compose exec php php artisan route:cache
docker-compose exec php php artisan view:cache

# Install frontend dependencies and build
docker-compose exec react npm install
docker-compose exec react npm run build
```

## 7.3 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'

      - name: Install Dependencies
        run: composer install

      - name: Run Tests
        run: php artisan test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/pharmacy-platform
            git pull origin main
            docker-compose up -d --build
            docker-compose exec php php artisan migrate --force
            docker-compose exec php php artisan config:cache
```

## 7.4 Post-Deployment Checklist
- [ ] SSL certificates installed
- [ ] DNS wildcard configured for subdomains
- [ ] Database backups scheduled
- [ ] Redis caching enabled
- [ ] Queue workers running
- [ ] Monitoring setup (e.g., Laravel Telescope)
- [ ] Error tracking (e.g., Sentry)
- [ ] Performance testing completed

## 7.5 Deliverables
- ✅ Complete test suite
- ✅ Docker setup
- ✅ Production deployment
- ✅ CI/CD pipeline
- ✅ Monitoring & logging

---

# 📊 Progress Tracking

## Overall Progress

| Phase | Status | Progress | Notes |
|-------|--------|----------|-------|
| Phase 1 | ⏳ Pending | 0% | Foundation |
| Phase 2 | ⏳ Pending | 0% | Authentication |
| Phase 3 | ⏳ Pending | 0% | Super Admin |
| Phase 4 | ⏳ Pending | 0% | Pharmacy System |
| Phase 5 | ⏳ Pending | 0% | E-commerce |
| Phase 6 | ⏳ Pending | 0% | Supply Chain |
| Phase 7 | ⏳ Pending | 0% | Deployment |

---

# 🚀 Next Steps

1. Start with Phase 1: Project Foundation
2. Set up Laravel backend with all migrations
3. Create React frontend structure
4. Implement multi-tenancy middleware
5. Build authentication system

---

*Last Updated: $(date)*
*Total Estimated Time: 20 weeks*
