using Bookify_Hotel_Reservation_System__DAL.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;

namespace Bookify_Hotel_Reservation_System__DAL.Contexts
{
    public class BookifyDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
    {
        public BookifyDbContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<RoomType> RoomTypes { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Amenity> Amenities { get; set; }
        public DbSet<RoomAmenity> RoomAmenities { get; set; }
        public DbSet<Review> Reviews { get; set; }
        

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Booking - User
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.User)
                .WithMany(u => u.Bookings)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            // Booking - Room
            modelBuilder.Entity<Booking>()
                .HasOne(b=>b.Room)
                .WithMany(r=>r.Bookings)
                .HasForeignKey(b=>b.RoomId)
                .OnDelete(DeleteBehavior.NoAction);

            // Booking - Payment
            modelBuilder.Entity<Booking>()
                .HasOne(b=>b.Payment)
                .WithOne(p=>p.Booking)
                .HasForeignKey<Payment>(p=>p.Id)
                .OnDelete(DeleteBehavior.NoAction);

            // Room - RoomType
            modelBuilder.Entity<Room>()
                .HasOne(r=>r.RoomType)
                .WithMany(rt => rt.Rooms)
                .HasForeignKey(r=> r.RoomTypeId)
                .OnDelete(DeleteBehavior.NoAction);
            // RoomAmenity
            modelBuilder.Entity<RoomAmenity>()
                .HasKey(ra => new { ra.RoomID, ra.AmenityID });

            // Room - RoomAnemity - Anemity
            modelBuilder.Entity<RoomAmenity>()
                .HasOne(ra => ra.Room)
                .WithMany(r=>r.RoomAmenities)
                .HasForeignKey(ra=>ra.RoomID)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<RoomAmenity>()
                .HasOne(ra => ra.Amenity)
                .WithMany(a=> a.RoomAmenities)
                .HasForeignKey(ra => ra.AmenityID)
                .OnDelete(DeleteBehavior.NoAction);

            // Review - User
            modelBuilder.Entity<Review>()
                .HasOne(r => r.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r=>r.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            // Handling decimal precision
            modelBuilder.Entity<RoomType>()
            .Property(rt => rt.BasePrice)
            .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Room>()
                .Property(r => r.PricePerDay)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Booking>()
                .Property(b => b.Price)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Payment>()
                .Property(p => p.Amount)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Review>()
                .Property(r => r.Rate)
                .HasColumnType("decimal(3,1)");

        }

    }
}
