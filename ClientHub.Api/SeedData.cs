namespace ClientHub.Api
{
    using ClientHub.Api.Models;

    public static class SeedData
    {
        public static void Seed(AppDbContext db)
        {
            if (db.Clients.Any()) return;

            var acme = new Client { Name = "Acme Corp", Email = "info@acme.com", Company = "Acme", Notes = "Priority" };
            var globex = new Client { Name = "Globex Ltd", Email = "contact@globex.com", Company = "Globex" };
            db.Clients.AddRange(acme, globex);
            db.SaveChanges();

            db.Interactions.AddRange(
                new Interaction { ClientId = acme.Id, Type = "Call", Summary = "Kickoff call" },
                new Interaction { ClientId = acme.Id, Type = "Email", Summary = "Sent proposal" },
                new Interaction { ClientId = globex.Id, Type = "Meeting", Summary = "Scoping session" }
            );
            db.SaveChanges();
        }
    }
}
