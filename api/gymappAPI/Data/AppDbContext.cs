using gymappAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace gymappAPI.Data
{
	public class AppDbContext : DbContext

	{
		public AppDbContext(DbContextOptions options) : base(options){}

		public DbSet<User> Users { get; set; }
		
		public DbSet<Workout> Workouts { get; set; }
		
		public DbSet<Label> Labels { get; set; }
		
		public DbSet<Food> Foods { get; set; }
		
		public DbSet<LoggedFood> LoggedFoods { get; set; }
		
		public DbSet<FriendRequest> FriendRequests { get; set; }
		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			// Configure Workout → Label with cascade delete
			modelBuilder.Entity<Workout>()
				.HasMany(w => w.Labels)
				.WithOne() // no reverse nav property in Label
				.HasForeignKey("WorkoutId") // EF inferred it; make it explicit
				.OnDelete(DeleteBehavior.Cascade);
		}
	}
}

