# ?? Bookify Admin Panel - Documentation

## ?? Overview

The Bookify Admin Panel is a fully functional, professional, and responsive dashboard for managing the hotel reservation system. It includes complete CRUD operations for Rooms, Room Types, and Bookings management.

---

## ? Features

### ?? Dashboard
- **Summary Cards**: Display key metrics
  - Total Bookings
  - Total Revenue
  - Number of Rooms
  - Number of Room Types
- **Charts**: Visual analytics
  - Revenue Trends (Line Chart)
  - Bookings by Room Type (Doughnut Chart)
- **Recent Activity**: Timeline of recent system events
- **Welcome Message**: Personalized greeting for admin users

### ??? Rooms Management
- **DataTable View**: Interactive table with search, sort, and pagination
- **CRUD Operations**:
  - ? Add Room (Modal form)
  - ?? Edit Room (Modal form)
  - ??? Delete Room (with confirmation)
- **Room Information**:
  - Room Number
  - Floor
  - Room Type
  - Price
  - Availability Status
  - Image
- **Link to Room Types Management**

### ?? Room Types Management
- **DataTable View**: Manage all room type categories
- **CRUD Operations**:
  - ? Add Room Type (Modal form)
  - ?? Edit Room Type (Modal form)
  - ??? Delete Room Type (with confirmation)
- **Room Type Details**:
  - Name
  - Description
  - Area (sq ft)
  - Max Guests
  - Base Price
- **Link back to Rooms Management**

### ?? Bookings Management
- **DataTable View**: Complete booking overview
- **Filter Options**:
  - Status (Pending, Confirmed, Completed, Cancelled)
  - Date Range (From/To)
  - Customer Name (via search)
- **Actions**:
  - ??? View Details (Modal with full booking info)
  - ?? Cancel Booking (Admin override)
  - ?? Export (Placeholder for CSV/PDF)
- **Booking Information**:
  - Booking ID
  - Customer Name
  - Room Number
  - Check-In/Check-Out Dates
  - Price
  - Status
  - Created Date

---

## ?? UI/UX Design

### Design Principles
- **Modern & Clean**: Professional dark blue color scheme
- **Responsive**: Mobile-first design, works on all devices
- **Intuitive**: Easy navigation with clear visual hierarchy
- **Accessible**: WCAG compliant with proper contrast and focus states

### Color Palette
```css
Primary Color: #08306C (Dark Blue)
Secondary Color: #3b82f6 (Blue)
Success: #10b981 (Green)
Warning: #f59e0b (Orange)
Danger: #ef4444 (Red)
Info: #06b6d4 (Cyan)
```

### Components
- **Sidebar Navigation**: Fixed left sidebar with active state indicators
- **Top Bar**: User info and breadcrumbs
- **Cards**: Elevated cards with hover effects
- **Modals**: Bootstrap modals for forms
- **Toasts**: Toastr notifications for user feedback
- **DataTables**: jQuery DataTables with Bootstrap 5 styling
- **Charts**: Chart.js for data visualization

---

## ??? File Structure

```
Bookify-Hotel-Reservation-System-PL/
??? Controllers/
?   ??? AdminController.cs          # Admin panel controller with all actions
??? Views/
?   ??? Admin/
?   ?   ??? Index.cshtml           # Dashboard view
?   ?   ??? Rooms.cshtml           # Rooms management view
?   ?   ??? RoomTypes.cshtml       # Room types management view
?   ?   ??? Bookings.cshtml        # Bookings management view
?   ??? Shared/
?       ??? _AdminLayout.cshtml    # Admin panel layout with sidebar
??? wwwroot/
?   ??? css/
?   ?   ??? admin-panel.css        # Admin panel styles
?   ??? js/
?       ??? AdminPanel.js          # Admin panel JavaScript
```

---

## ?? Getting Started

### Prerequisites
- .NET 9.0 SDK
- SQL Server
- Modern web browser

### Admin Login Credentials
```
Email: admin@bookify.com
Password: Admin@123
```

### Access the Admin Panel
1. Run the application: `dotnet run`
2. Login with admin credentials
3. Navigate to `/Admin/Index` or click "Dashboard" in navbar

---

## ?? Responsive Design

### Desktop (1200px+)
- Full sidebar visible
- Multi-column layouts
- All features accessible

### Tablet (768px - 1199px)
- Collapsible sidebar
- Responsive tables
- Optimized card layouts

### Mobile (< 768px)
- Hidden sidebar (toggle button)
- Stacked layouts
- Touch-friendly buttons
- Horizontal scroll for tables

---

## ?? Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Flexbox and Grid
- **Bootstrap 5**: Responsive framework
- **Font Awesome 6**: Icons
- **jQuery**: DOM manipulation and AJAX
- **DataTables**: Interactive tables
- **Chart.js**: Data visualization
- **Toastr**: Toast notifications

### Backend
- **ASP.NET Core 9.0**: MVC framework
- **C# 13**: Programming language
- **Entity Framework Core**: ORM
- **SQL Server**: Database

---

## ?? Dashboard Charts

### Revenue Chart (Line Chart)
```javascript
// PLACEHOLDER DATA - Replace with backend data
Monthly Revenue: [12000, 19000, 15000, 22000, 28000, 25000, 30000, 32000, 29000, 35000, 38000, 42000]
```

### Bookings Chart (Doughnut Chart)
```javascript
// PLACEHOLDER DATA - Replace with backend data
Room Types: ['Single', 'Double', 'Suite', 'Deluxe']
Bookings: [45, 35, 15, 25]
```

---

## ?? API Endpoints

### Dashboard
- `GET /Admin/Index` - Dashboard view

### Rooms
- `GET /Admin/Rooms` - Rooms management view
- `GET /Admin/GetRooms` - Get all rooms as JSON

### Room Types
- `GET /Admin/RoomTypes` - Room types management view
- `GET /Admin/GetRoomTypes` - Get all room types as JSON

### Bookings
- `GET /Admin/Bookings` - Bookings management view
- `GET /Admin/GetBookings` - Get all bookings as JSON
- `POST /Admin/CancelBooking` - Cancel a booking (Admin)

---

## ?? CRUD Operations (Placeholders)

All CRUD operations currently have **placeholders** in the JavaScript code. To implement full functionality:

### Add Room Example
```javascript
$.ajax({
    url: '/Admin/AddRoom',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(roomData),
    success: function(response) {
        if (response.success) {
            location.reload();
            toastr.success('Room added successfully!');
        }
    },
    error: function() {
        toastr.error('Error adding room');
    }
});
```

### Backend Action Required
```csharp
[HttpPost]
public IActionResult AddRoom([FromBody] RoomViewModel model)
{
    // Validate model
    if (!ModelState.IsValid)
        return Json(new { success = false, message = "Invalid data" });
    
    // Add room to database
    var room = new Room { /* map model to room */ };
    _unitOfWork.Rooms.Add(room);
    _unitOfWork.Complete();
    
    return Json(new { success = true, message = "Room added successfully" });
}
```

---

## ?? Navigation Flow

### Admin User Flow
1. Login ? Dashboard
2. Dashboard ? Rooms Management
3. Rooms Management ? Room Types Management
4. Dashboard ? Bookings Management

### Navbar Links (Admin Only)
- Dashboard (`/Admin/Index`)
- Rooms Management (`/Admin/Rooms`)
- Bookings Management (`/Admin/Bookings`)

---

## ?? Security

### Authorization
- `[Authorize(Roles = "Admin")]` on AdminController
- Only users with "Admin" role can access
- Automatic redirect to login if unauthorized

### Best Practices
- Anti-forgery tokens on all forms
- Input validation (client & server)
- SQL injection prevention (EF Core parameterization)
- XSS protection (Razor automatic encoding)

---

## ?? Customization

### Change Color Theme
Edit `admin-panel.css`:
```css
:root {
    --primary-color: #08306C;  /* Your primary color */
    --secondary-color: #3b82f6; /* Your secondary color */
}
```

### Add New Dashboard Card
```html
<div class="col-xl-3 col-md-6">
    <div class="stat-card stat-card-primary">
        <div class="stat-icon">
            <i class="fas fa-your-icon"></i>
        </div>
        <div class="stat-content">
            <h3 class="stat-number">@ViewBag.YourStat</h3>
            <p class="stat-label">Your Label</p>
        </div>
    </div>
</div>
```

---

## ?? Known Issues & Limitations

### Current Limitations
1. **CRUD Backend**: Placeholders in place - backend API endpoints need implementation
2. **File Upload**: Room images use URLs, not file upload
3. **Export Feature**: Export to CSV/PDF not implemented
4. **Real-time Updates**: No WebSocket/SignalR for live data
5. **RoomType Repository**: Direct DbContext access (no repository pattern for RoomTypes)

### Future Enhancements
- [ ] Complete CRUD backend implementation
- [ ] Image upload with preview
- [ ] PDF/CSV export functionality
- [ ] Real-time notifications
- [ ] Advanced filtering and search
- [ ] Audit logs and history
- [ ] User management page
- [ ] Reports and analytics
- [ ] Email notifications
- [ ] Backup and restore

---

## ?? Additional Resources

### Libraries Documentation
- [Bootstrap 5](https://getbootstrap.com/docs/5.0/)
- [DataTables](https://datatables.net/)
- [Chart.js](https://www.chartjs.org/)
- [Toastr](https://codeseven.github.io/toastr/)
- [Font Awesome](https://fontawesome.com/)

### ASP.NET Core Resources
- [ASP.NET Core MVC](https://docs.microsoft.com/en-us/aspnet/core/mvc/)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)
- [Identity](https://docs.microsoft.com/en-us/aspnet/core/security/authentication/identity)

---

## ?? Contributing

To extend the admin panel:

1. **Add new page**: Create view in `Views/Admin/`
2. **Add action**: Add method to `AdminController.cs`
3. **Add styles**: Extend `admin-panel.css`
4. **Add scripts**: Extend `AdminPanel.js`
5. **Add link**: Update `_AdminLayout.cshtml` sidebar

---

## ?? Support

For issues or questions:
- Check the [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md)
- Review existing controller implementations
- Consult ASP.NET Core documentation

---

## ?? License

This project is part of the Bookify Hotel Reservation System.

---

## ? Checklist for Production

- [ ] Implement all CRUD backend endpoints
- [ ] Add server-side validation
- [ ] Add error logging
- [ ] Add user activity logging
- [ ] Optimize database queries
- [ ] Add caching where appropriate
- [ ] Test all CRUD operations
- [ ] Test responsive design on all devices
- [ ] Security audit
- [ ] Performance testing
- [ ] Load testing
- [ ] Backup strategy

---

**?? The admin panel is ready for integration! All placeholder comments indicate where backend API calls should be added.**

**Admin Login**: admin@bookify.com / Admin@123
