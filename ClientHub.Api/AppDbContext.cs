namespace ClientHub.Api
{
    using ClientHub.Api.Models;
    using Microsoft.EntityFrameworkCore;

    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Client> Clients => Set<Client>();
        public DbSet<Interaction> Interactions => Set<Interaction>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Interaction>()
                .HasOne<Client>()
                .WithMany(c => c.Interactions)
                .HasForeignKey(i => i.ClientId);

            modelBuilder.Entity<Client>().HasIndex(c => c.Email);
            modelBuilder.Entity<Client>().HasIndex(c => c.Company);
            modelBuilder.Entity<Client>().HasIndex(c => c.Phone);
            modelBuilder.Entity<Interaction>().HasIndex(i => i.CreatedAt);
        }
    }
}
