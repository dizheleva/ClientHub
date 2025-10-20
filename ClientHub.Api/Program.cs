
namespace ClientHub.Api
{
    using ClientHub.Api.Validation;
    using FluentValidation;
    using FluentValidation.AspNetCore;
    using Microsoft.EntityFrameworkCore;

    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
                       
            builder.Services.AddControllers();

            // FluentValidation
            builder.Services.AddFluentValidationAutoValidation();
            builder.Services.AddValidatorsFromAssemblyContaining<CreateClientDtoValidator>();

            // AutoMapper
            builder.Services.AddAutoMapper(typeof(Program).Assembly);

            // DbContext
            builder.Services.AddDbContext<AppDbContext>(opt =>
               opt.UseSqlite("Data Source=clienthub.db"));

            // Swagger
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // CORS
            builder.Services.AddCors(o =>
                o.AddPolicy("AllowAll", p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

            var app = builder.Build();

            using (var scope = app.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                db.Database.Migrate();
                SeedData.Seed(db);
            }           

            app.UseSwagger();
            app.UseSwaggerUI();

            app.UseCors("AllowAll");
            app.MapControllers();

            app.Run();
        }
    }
}
