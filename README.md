# ?? Bookify - Hotel Reservation System

[![.NET](https://img.shields.io/badge/.NET-9.0-512BD4?style=flat-square&logo=dotnet)](https://dotnet.microsoft.com/)
[![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-MVC-512BD4?style=flat-square)](https://docs.microsoft.com/en-us/aspnet/core/)
[![Entity Framework](https://img.shields.io/badge/Entity%20Framework-Core%209.0.11-512BD4?style=flat-square)](https://docs.microsoft.com/en-us/ef/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-Database-CC2927?style=flat-square&logo=microsoft-sql-server)](https://www.microsoft.com/sql-server)

A comprehensive, production-ready hotel reservation management system built with **ASP.NET Core 9.0** and **Entity Framework Core**. Features complete booking workflow, payment processing, review system, and powerful admin panel with analytics.

## ?? Table of Contents

- [Features](#-features)
- [Technologies Used](#-technologies-used)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Database Schema](#-database-schema)
- [Project Structure](#-project-structure)
- [Usage Guide](#-usage-guide)
- [API Endpoints](#-api-endpoints)
- [Configuration](#-configuration)
- [Contributing](#-contributing)
- [License](#-license)

## ? Features

### Core Functionality

#### ?? Authentication & Authorization
- **ASP.NET Core Identity** integration
- User registration and login
- Role-based access (User & Admin)
- Password requirements (min 6 chars, uppercase, lowercase, digit)
- Remember me functionality
- Secure cookies (HttpOnly, Secure, SameSite: Strict)
- 7-day expiration with sliding expiration
- Access denied handling
- Auto-seeding of admin user

#### ?? Room Management
- Browse rooms with grid layout (responsive: 4?3?2?1 columns)
- Filter by room type, guests, price range
- Real-time client-side filtering
- Room details with full specifications
- Shopping cart functionality
- Add/remove rooms from cart
- LocalStorage cart persistence
- Available/unavailable status

#### ?? Booking System
- Interactive booking form with date picker (Flatpickr)
- Real-time availability checking
- Booked dates highlighted in red
- Date validation (no past dates, checkout > checkin)
- Automatic price calculation
- Booking conflict prevention
- My Bookings page for users
- Cancel bookings (with status validation)
- Booking status management (Pending, Confirmed, Cancelled, Completed)

#### ?? Payment Processing
- Demo payment form (card number, expiry, CVC)
- Client-side card validation
- Transaction ID generation
- Invoice generation with booking details
- PDF invoice download (html2pdf.js)
- Payment confirmation
- Booking status update to Confirmed
- Payment history tracking

#### ? Reviews & Ratings
- 5-star rating system with interactive UI
- Review submission (10-500 characters)
- Character counter with color indicators
- Client-side validation
- User authentication required
- Admin review moderation
- Delete inappropriate reviews

#### ?? Admin Dashboard
- Statistics cards (bookings, revenue, rooms, types)
- Revenue trends chart (Chart.js line chart)
- Bookings by room type chart (doughnut chart)
- Recent activity feed
- Responsive dashboard layout

#### ??? Admin Panel
- **Rooms Management**: Add, edit, delete rooms
- **Room Types Management**: CRUD operations for room types
- **Bookings Management**: View all bookings, filter, cancel
- **Reviews Management**: View and delete reviews
- **Admin Creation**: Create additional admin accounts
- DataTables integration (search, sort, pagination)
- Modal forms for editing
- Success/error notifications

### UI/UX Features

- Modern blue color scheme (#08306C, #3b82f6, #2563eb)
- Responsive design (mobile-first)
- Glass morphism effects
- Smooth animations and transitions
- Toast notifications (Toastify)
- Loading states
- Empty states
- Hover effects
- Professional gradients
- Bootstrap 5 styling
- Font Awesome icons

## ??? Technologies Used

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| .NET | 9.0 | Core framework |
| C# | 13.0 | Programming language |
| ASP.NET Core MVC | 9.0 | Web framework |
| Entity Framework Core | 9.0.11 | ORM |
| SQL Server | 2019+ | Database |
| ASP.NET Core Identity | 9.0.11 | Authentication |

### NuGet Packages

```xml
<ItemGroup>
  <!-- Entity Framework Core -->
  <PackageReference Include="Microsoft.EntityFrameworkCore" Version="9.0.11" />
  <PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="9.0.11" />
  <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="9.0.11" />
  <PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="9.0.11" />
  
  <!-- Identity -->
  <PackageReference Include="Microsoft.AspNetCore.Identity.EntityFrameworkCore" Version="9.0.11" />
  
  <!-- Code Generation -->
  <PackageReference Include="Microsoft.VisualStudio.Web.CodeGeneration.Design" Version="9.0.0" />
</ItemGroup>
```

### Frontend

| Library | Purpose |
|---------|---------|
| Bootstrap 5.x | UI framework |
| jQuery 3.x | DOM manipulation |
| Font Awesome 6.4.0 | Icons |
| Flatpickr | Date picker |
| Toastify JS | Notifications |
| html2pdf.js | PDF generation |
| Chart.js | Charts |
| DataTables 1.13.6 | Table enhancement |
| jQuery Validation | Form validation |

### Custom CSS Files
- `RoomsStyle.css` - Room pages styling
- `contact.css` - Contact page
- `admin-panel.css` - Admin dashboard
- `book.css` - Booking pages
- `payment.css` - Payment pages
- `amenities.css` - Amenities page

### Custom JavaScript Files
- `rooms-client-filter.js` - Room filtering
- `book.js` - Booking functionality
- `payment.js` - Payment processing
- `contact.js` - Contact & reviews
- `my-bookings.js` - Booking management
- `AdminPanel.js` - Admin operations
- `admin-dashboard.js` - Dashboard charts

## ??? Architecture

### 3-Layer Architecture

```
???????????????????????????????????????????
?   Presentation Layer (PL)               ?
?   - Controllers, Views, ViewModels      ?
?   - JavaScript, CSS                     ?
?   - Client-side validation              ?
???????????????????????????????????????????
                  ?
???????????????????????????????????????????
?   Business Logic Layer (BLL)            ?
?   - Repositories (IUnitOfWork)          ?
?   - Business rules                      ?
?   - Data validation                     ?
???????????????????????????????????????????
                  ?
???????????????????????????????????????????
?   Data Access Layer (DAL)               ?
?   - DbContext (BookifyDbContext)        ?
?   - Models (Entities)                   ?
?   - Migrations                          ?
???????????????????????????????????????????
```

### Design Patterns

- **MVC Pattern**: Separation of concerns
- **Repository Pattern**: Data access abstraction
- **Unit of Work Pattern**: Transaction management
- **Dependency Injection**: IoC container
- **ViewModel Pattern**: Data transfer
- **SOLID Principles**: Clean code design

## ?? Getting Started

### Prerequisites

- [.NET SDK 9.0+](https://dotnet.microsoft.com/download/dotnet/9.0)
- [SQL Server 2019+](https://www.microsoft.com/sql-server) or SQL Server Express
- [Visual Studio 2022](https://visualstudio.microsoft.com/) or VS Code
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/mohamedali559/Bookify-Hotel-Reservation-System.git
cd Bookify-Hotel-Reservation-System
```

2. **Update connection string**
   
   Edit `Bookify-Hotel-Reservation-System-PL/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "cs": "Data Source=YOUR_SERVER;Initial Catalog=Bookify;Integrated Security=True;Encrypt=False;Trust Server Certificate=True"
  }
}
```

3. **Restore packages**
```bash
dotnet restore
```

4. **Apply migrations**
```bash
cd Bookify-Hotel-Reservation-System-DAL
dotnet ef database update
```
Or in Package Manager Console:
```powershell
Update-Database
```

5. **Run the application**
```bash
cd ../Bookify-Hotel-Reservation-System-PL
dotnet run
```

6. **Access the application**
   - Navigate to `https://localhost:7XXX`
   - Default admin: `admin@bookify.com` / `Admin@123`

## ?? Database Schema

### Main Entities

#### ApplicationUser (Identity)
- Id, FullName, Address, Email, PhoneNumber
- Relations: Bookings, Reviews

#### Room
- Id, RoomNumber, Floor, IsAvailable, ImageUrl, RoomTypeId
- Relations: RoomType, Bookings, RoomAmenities

#### RoomType
- Id, Name, Description, Area, Guests, BasePrice
- Relations: Rooms

#### Booking
- Id, CheckInDate, CheckOutDate, Price, Status, CreatedAt
- UserId, RoomId
- Relations: User, Room, Payment
- Status: Pending, Confirmed, Cancelled, Completed

#### Payment
- Id (PK/FK to Booking), Amount, PaymentDate, PaymentMethod
- TransactionId, Status
- Relations: Booking (One-to-One)

#### Review
- Id, Rate (1-5), Description, CreatedAt, UserId
- Relations: User

#### Amenity
- Id, Name, Description
- Relations: RoomAmenities (Many-to-Many with Room)

### Seed Data
- Admin user: `admin@bookify.com` / `Admin@123`
- Roles: Admin, User

## ?? Project Structure

```
Bookify-Hotel-Reservation-System/
?
??? Bookify-Hotel-Reservation-System-DAL/     # Data Access Layer
?   ??? Contexts/
?   ?   ??? BookifyDbContext.cs               # Database context
?   ??? Models/                                # Entity models
?   ?   ??? ApplicationUser.cs
?   ?   ??? Room.cs
?   ?   ??? RoomType.cs
?   ?   ??? Booking.cs
?   ?   ??? Payment.cs
?   ?   ??? Review.cs
?   ?   ??? Amenity.cs
?   ?   ??? RoomAmenity.cs
?   ??? Migrations/                            # EF migrations
?
??? Bookify-Hotel-Reservation-System-BLL/     # Business Logic Layer
?   ??? Interfaces/                            # Repository interfaces
?   ?   ??? IUnitOfWork.cs
?   ?   ??? IGenericRepository.cs
?   ?   ??? ...
?   ??? Repositories/                          # Repository implementations
?       ??? UnitOfWork.cs
?       ??? GenericRepository.cs
?       ??? ...
?
??? Bookify-Hotel-Reservation-System-PL/      # Presentation Layer
    ??? Controllers/                           # MVC controllers
    ?   ??? AccountController.cs               # Auth
    ?   ??? AdminController.cs                 # Admin panel
    ?   ??? BookController.cs                  # Bookings
    ?   ??? PaymentController.cs               # Payments
    ?   ??? RoomController.cs                  # Rooms
    ?   ??? ContactController.cs               # Contact & reviews
    ?   ??? HomeController.cs
    ?   ??? AboutController.cs
    ?   ??? GalleryController.cs
    ?   ??? AmenityController.cs
    ?
    ??? Views/                                 # Razor views
    ?   ??? Shared/
    ?   ?   ??? _HotelLayout.cshtml            # Main layout
    ?   ?   ??? _AdminLayout.cshtml            # Admin layout
    ?   ?   ??? _AuthLayout.cshtml             # Auth layout
    ?   ??? Account/                           # Login, Register
    ?   ??? Admin/                             # Admin views
    ?   ??? Book/                              # Booking views
    ?   ??? Payment/                           # Payment views
    ?   ??? Room/                              # Room views
    ?   ??? Contact/                           # Contact views
    ?
    ??? Models/                                # ViewModels
    ?   ??? LoginViewModel.cs
    ?   ??? RegisterViewModel.cs
    ?   ??? BookingViewModel.cs
    ?   ??? PaymentViewModel.cs
    ?   ??? RoomViewModel.cs
    ?   ??? ReviewViewModel.cs
    ?   ??? DashboardViewModel.cs
    ?
    ??? wwwroot/                               # Static files
    ?   ??? css/                               # Stylesheets
    ?   ??? js/                                # JavaScript
    ?   ??? images/                            # Images
    ?   ??? lib/                               # Third-party libs
    ?
    ??? Program.cs                             # App configuration
    ??? appsettings.json                       # Settings
```

## ?? Usage Guide

### For Users

1. **Register/Login**
   - Click Register to create account
   - Or Login with existing credentials
   - Or use guest features (limited)

2. **Browse Rooms**
   - Navigate to Rooms page
   - Use filters (type, guests, price)
   - View room details
   - Add rooms to cart

3. **Make Booking**
   - Open cart, click "Go to Reservation"
   - Select check-in/check-out dates
   - Enter guest count
   - Proceed to payment

4. **Complete Payment**
   - Review booking details
   - Enter card information (demo)
   - Submit payment
   - Download PDF invoice

5. **Manage Bookings**
   - Go to "My Bookings"
   - View booking history
   - Cancel bookings (if allowed)

6. **Leave Review**
   - Visit Contact page
   - Rate your experience (1-5 stars)
   - Write review description
   - Submit review

### For Admins

1. **Access Admin Panel**
   - Login with admin account
   - Navigate to `/Admin/Index`

2. **Dashboard**
   - View statistics
   - Monitor charts
   - Check recent activity

3. **Manage Rooms**
   - Add/Edit/Delete rooms
   - Set room numbers, floors
   - Assign room types
   - Update availability

4. **Manage Room Types**
   - Create room types
   - Set prices and capacity
   - Edit descriptions
   - Delete unused types

5. **Manage Bookings**
   - View all bookings
   - Filter by status/date
   - Cancel bookings
   - View customer details

6. **Manage Reviews**
   - View all reviews
   - Delete inappropriate content

7. **Create Admins**
   - Add new admin accounts
   - Set credentials
   - Assign admin role

## ?? API Endpoints

### Authentication
- `GET /Account/Login` - Login page
- `POST /Account/Login` - Process login
- `GET /Account/Register` - Register page
- `POST /Account/Register` - Process registration
- `POST /Account/Logout` - Logout

### Bookings
- `GET /Book/Index` - Booking form
- `POST /Book/Index` - Create booking
- `GET /Book/MyBookings` - View bookings
- `POST /Book/CancelBooking` - Cancel booking
- `GET /Book/GetBookedDates` - Get booked dates

### Payments
- `GET /Payment/Index` - Payment page
- `POST /Payment/ProcessPayment` - Process payment
- `GET /Payment/GetPaymentDetails` - Get details

### Admin (Requires Admin Role)
- `GET /Admin/Index` - Dashboard
- `GET /Admin/Rooms` - Rooms management
- `GET /Admin/RoomTypes` - Room types
- `GET /Admin/Bookings` - Bookings management
- `GET /Admin/Reviews` - Reviews management
- `POST /Admin/CreateAdmin` - Create admin

## ?? Configuration

### Identity Settings
```csharp
// Program.cs
builder.Services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
{
    options.Password.RequiredLength = 6;
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.User.RequireUniqueEmail = true;
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
})
.AddEntityFrameworkStores<BookifyDbContext>()
.AddDefaultTokenProviders();
```

### Cookie Configuration
```csharp
builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/Account/Login";
    options.LogoutPath = "/Account/Logout";
    options.AccessDeniedPath = "/Account/AccessDenied";
    options.ExpireTimeSpan = TimeSpan.FromDays(7);
    options.SlidingExpiration = true;
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.Strict;
});
```

## ?? Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/YourFeature`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/YourFeature`)
5. Open Pull Request

### Guidelines
- Follow C# naming conventions
- Add comments for complex logic
- Write unit tests
- Update documentation

## ?? License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

## ?? Authors

- **Mohamed Ali** - [GitHub](https://github.com/mohamedali559)

## ?? Acknowledgments

- ASP.NET Core team
- Entity Framework Core team
- Bootstrap framework
- Font Awesome icons
- Chart.js library
- Flatpickr library
- DataTables plugin
- DEPI program

## ?? Contact

- **Email**: info@bookify.com
- **GitHub Issues**: [Report Issue](https://github.com/mohamedali559/Bookify-Hotel-Reservation-System/issues)

## ?? Educational Purpose

Developed as a graduation project for the DEPI (Digital Egypt Pioneers Initiative) program, demonstrating:
- Modern web development with ASP.NET Core
- Clean architecture principles
- Full-stack development skills
- Database design and management
- UI/UX design capabilities
- Professional coding practices

---

**Made with ?? using ASP.NET Core 9.0**
