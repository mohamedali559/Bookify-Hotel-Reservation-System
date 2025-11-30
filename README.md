# 🏨 Bookify - Hotel Reservation System

[![.NET](https://img.shields.io/badge/.NET-9.0-512BD4?style=flat-square&logo=dotnet)](https://dotnet.microsoft.com/)
[![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-MVC-512BD4?style=flat-square)](https://docs.microsoft.com/en-us/aspnet/core/)
[![Entity Framework](https://img.shields.io/badge/Entity%20Framework-Core-512BD4?style=flat-square)](https://docs.microsoft.com/en-us/ef/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-Database-CC2927?style=flat-square&logo=microsoft-sql-server)](https://www.microsoft.com/sql-server)

A modern, full-featured hotel reservation system built with ASP.NET Core MVC, featuring a clean architecture pattern with separate layers for Presentation, Business Logic, and Data Access.

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Technologies Used](#-technologies-used)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Recent Updates](#-recent-updates)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🎯 Core Features
- **Room Management System**
  - Browse available rooms with advanced filtering
  - Real-time room availability checking
  - Detailed room information with amenities
  - Interactive room cards with hover effects
  - Image galleries for each room

- **Shopping Cart Functionality**
  - Add multiple rooms to cart
  - Remove rooms from cart
  - Persistent cart using localStorage
  - Real-time cart counter
  - Smooth cart popup with glass morphism design
  - Direct navigation to reservation from cart

- **Advanced Search & Filtering**
  - Search by room name/keyword
  - Filter by room type
  - Filter by number of guests
  - Filter by price range
  - Client-side dynamic filtering

- **Responsive Design**
  - Fully responsive on all devices
  - Mobile-first approach
  - Touch-friendly interface
  - Optimized for tablets and desktops

### 🎨 UI/UX Features
- **Modern Design System**
  - Clean blue color scheme (`#0b3a66`, `#3b82f6`, `#2563eb`)
  - Glass morphism effects
  - Smooth animations and transitions
  - Professional shadows and gradients
  
- **Interactive Components**
  - Toast notifications for user feedback
  - Animated room cards
  - Smooth hover effects
  - Loading states
  - Empty state designs

- **Accessibility**
  - Semantic HTML structure
  - ARIA labels where needed
  - Keyboard navigation support
  - Screen reader friendly

## 🏗️ Architecture

This project follows the **Three-Tier Architecture** pattern:

```
┌─────────────────────────────────────────┐
│   Presentation Layer (PL)               │
│   - ASP.NET Core MVC                    │
│   - Views, Controllers, ViewModels      │
│   - Client-side validation              │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│   Business Logic Layer (BLL)            │
│   - Business rules                      │
│   - Data validation                     │
│   - Service layer                       │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│   Data Access Layer (DAL)               │
│   - Entity Framework Core               │
│   - Database context                    │
│   - Repository pattern                  │
│   - SQL Server database                 │
└─────────────────────────────────────────┘
```

### Layer Responsibilities

#### 🖥️ Presentation Layer (PL)
- User interface and user experience
- MVC controllers handling HTTP requests
- Razor views for rendering HTML
- ViewModels for data transfer
- Client-side scripts for interactivity
- Responsive CSS styling

#### 💼 Business Logic Layer (BLL)
- Business rules implementation
- Data validation
- Service classes
- DTO (Data Transfer Objects)
- Business exceptions handling

#### 🗄️ Data Access Layer (DAL)
- Entity Framework Core models
- Database context configuration
- Repository pattern implementation
- Database migrations
- LINQ queries

## 🛠️ Technologies Used

### Backend
- **Framework**: ASP.NET Core 9.0 MVC
- **ORM**: Entity Framework Core
- **Database**: SQL Server
- **Language**: C# 13.0
- **Design Patterns**: Repository, Unit of Work, Dependency Injection

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with flexbox and grid
- **JavaScript (ES6+)** - Client-side functionality
- **Bootstrap 5** - Responsive framework
- **Font Awesome 6.4** - Icon library
- **LocalStorage API** - Client-side data persistence

### Development Tools
- **Visual Studio 2022**
- **SQL Server Management Studio**
- **Git** for version control
- **NuGet** for package management

## 🚀 Getting Started

### Prerequisites
- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [SQL Server 2019+](https://www.microsoft.com/sql-server/sql-server-downloads) or SQL Server Express
- [Visual Studio 2022](https://visualstudio.microsoft.com/) (recommended) or VS Code

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/mohamedali559/Bookify-Hotel-Reservation-System.git
cd Bookify-Hotel-Reservation-System
```

2. **Update Connection String**
   
   Open `appsettings.json` in the PL project and update the connection string:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=BookifyDB;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

3. **Restore NuGet Packages**
```bash
dotnet restore
```

4. **Apply Database Migrations**
```bash
cd Bookify-Hotel-Reservation-System-DAL
dotnet ef database update
```

5. **Run the Application**
```bash
cd ../Bookify-Hotel-Reservation-System-PL
dotnet run
```

6. **Access the Application**
   
   Open your browser and navigate to: `https://localhost:5001` or `http://localhost:5000`

## 📁 Project Structure

```
Bookify-Hotel-Reservation-System/
│
├── Bookify-Hotel-Reservation-System-PL/          # Presentation Layer
│   ├── Controllers/                               # MVC Controllers
│   │   ├── RoomController.cs
│   │   ├── BookingController.cs
│   │   ├── ReservationController.cs
│   │   └── ...
│   ├── Views/                                     # Razor Views
│   │   ├── Room/
│   │   │   ├── Index.cshtml                      # Room listing page
│   │   │   └── Details.cshtml                    # Room details page
│   │   ├── Booking/
│   │   ├── Shared/
│   │   │   └── _Layout.cshtml                    # Main layout
│   │   └── ...
│   ├── wwwroot/                                   # Static files
│   │   ├── css/
│   │   │   ├── site.css
│   │   │   └── RoomsStyle.css                    # Room-specific styles
│   │   ├── js/
│   │   │   └── rooms-client-filter.js            # Client-side filtering
│   │   └── lib/                                   # Third-party libraries
│   └── ViewModels/                                # View models
│       └── RoomDetailsViewModel.cs
│
├── Bookify-Hotel-Reservation-System-BLL/          # Business Logic Layer
│   ├── Services/                                  # Business services
│   ├── DTOs/                                      # Data transfer objects
│   └── Interfaces/                                # Service interfaces
│
├── Bookify-Hotel-Reservation-System-DAL/          # Data Access Layer
│   ├── Models/                                    # Entity models
│   │   ├── Room.cs
│   │   ├── RoomType.cs
│   │   ├── Amenity.cs
│   │   ├── Booking.cs
│   │   └── ...
│   ├── Data/                                      # Database context
│   │   └── ApplicationDbContext.cs
│   ├── Repositories/                              # Repository implementations
│   └── Migrations/                                # EF Core migrations
│
└── README.md                                       # This file
```

## 📸 Screenshots

### Room Listing Page
- Modern card-based layout with room information
- Advanced filtering options (search, room type, guests, price)
- Shopping cart functionality
- Responsive grid layout (4 columns on desktop, adapts to mobile)

### Room Details Page
- **Hero Section**: Large room image with overlay information
- **Room Information Card**:
  - Room features and description
  - Capacity, size, and floor specifications
  - Prominent pricing display with gradient background
  - Booking information panel
- **Amenities Section**: Grid display of all room amenities
- **Action Buttons**: "Add to Cart" and "Back to Rooms"
- **Shopping Cart Integration**: Working cart with popup display

### Cart Popup
- Glass morphism design with backdrop blur
- List of selected rooms with details
- Remove functionality for each room
- "Go to Reservation" button
- Automatic cart count badge

## 🆕 Recent Updates

### Version 2.0 - UI/UX Overhaul (December 2024)

#### Room Details Page Redesign
- ✅ **Complete UI Redesign**
  - Changed from old beige/gold color scheme to modern blue theme
  - Implemented consistent color palette matching the rest of the application
  - Added professional gradients and shadows

- ✅ **Enhanced Layout**
  - Two-column grid layout (image + information)
  - Improved spacing and visual hierarchy
  - Better mobile responsiveness

- ✅ **Shopping Cart Integration**
  - Fixed cart icon not opening on details page
  - Added cart popup functionality
  - Implemented cart item display with remove option
  - Synchronized styling with room listing page
  - Added localStorage persistence

- ✅ **Improved Components**
  - Redesigned price section with gradient background
  - Enhanced room specifications cards
  - Updated amenities display with better icons
  - Added booking information panel
  - Improved toast notifications with color-coded types

- ✅ **Performance Optimizations**
  - Removed inline styles in favor of CSS classes
  - Consolidated styles into RoomsStyle.css
  - Improved JavaScript code organization
  - Better event handling

#### Technical Improvements
- Migrated to **.NET 9.0**
- Updated all NuGet packages
- Improved code organization
- Enhanced error handling
- Better separation of concerns

### Color Scheme Update
```css
/* Old Colors (Removed) */
--old-beige: #cbb58f;
--old-dark: #2e2b29;

/* New Colors (Current) */
--primary-blue: #0b3a66;
--accent-blue: #3b82f6;
--accent-blue-dark: #2563eb;
--gradient-blue: linear-gradient(135deg, #3b82f6, #2563eb);
```

## 🎯 Key Features Implementation

### Shopping Cart System
```javascript
// Cart data structure stored in localStorage
{
  roomId: number,
  roomTypeName: string,
  roomDescription: string,
  imageUrl: string,
  basePrice: number,
  guests: number,
  area: number,
  floor: number
}
```

### Client-Side Filtering
- Dynamic filtering without page reload
- Multiple filter criteria support
- Real-time results update
- Maintains filter state across navigation

### Responsive Breakpoints
```css
/* Desktop: 4 columns */
@media (min-width: 1200px) { grid-template-columns: repeat(4, 1fr); }

/* Tablet: 2-3 columns */
@media (min-width: 768px) and (max-width: 1199px) { grid-template-columns: repeat(3, 1fr); }

/* Mobile: 1 column */
@media (max-width: 767px) { grid-template-columns: 1fr; }
```

## 🔧 Configuration

### Database Configuration
The application uses Entity Framework Core with SQL Server. Configure the connection string in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=BookifyDB;Trusted_Connection=True;TrustServerCertificate=True"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

### Application Settings
- **Room Images**: Stored in `wwwroot/images/rooms/`
- **Cart Data**: Persisted in browser's localStorage
- **Session Timeout**: Configurable in `Startup.cs`

## 🧪 Testing

### Manual Testing Checklist
- [ ] Room listing page loads correctly
- [ ] Filtering works for all criteria
- [ ] Cart icon appears after adding items
- [ ] Cart popup opens and closes properly
- [ ] Items can be removed from cart
- [ ] Room details page displays correctly
- [ ] Navigation between pages works
- [ ] Responsive design works on mobile
- [ ] Toast notifications appear correctly

## 🚧 Future Enhancements

### Planned Features
- [ ] User authentication and authorization
- [ ] Online payment integration
- [ ] Email notifications
- [ ] Booking calendar view
- [ ] Review and rating system
- [ ] Admin dashboard for management
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Advanced reporting
- [ ] Integration with booking platforms

### Technical Improvements
- [ ] Implement unit tests
- [ ] Add integration tests
- [ ] Set up CI/CD pipeline
- [ ] Add API documentation (Swagger)
- [ ] Implement caching strategies
- [ ] Add logging framework
- [ ] Performance monitoring
- [ ] Security hardening

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Follow C# naming conventions
- Write clean, self-documenting code
- Add comments for complex logic
- Maintain consistent formatting
- Update README for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Mohamed Ali** - *Initial work* - [@mohamedali559](https://github.com/mohamedali559)

## 🙏 Acknowledgments

- ASP.NET Core documentation
- Entity Framework Core team
- Bootstrap framework
- Font Awesome icons
- DEPI (Digital Egypt Pioneers Initiative) program

## 📞 Contact & Support

For questions, issues, or suggestions:
- **GitHub Issues**: [Create an issue](https://github.com/mohamedali559/Bookify-Hotel-Reservation-System/issues)
- **Email**: Contact through GitHub profile

---

**Note**: This is a graduation project for the DEPI program. It demonstrates modern web development practices using ASP.NET Core MVC.

## 🎓 Educational Purpose

This project was developed as part of the DEPI (Digital Egypt Pioneers Initiative) graduation project requirements. It showcases:
- Clean architecture principles
- Modern web development practices
- Full-stack development skills
- Database design and implementation
- UI/UX design capabilities
- Problem-solving and implementation skills

---
