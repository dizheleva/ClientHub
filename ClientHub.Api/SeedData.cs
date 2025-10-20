namespace ClientHub.Api
{
    using ClientHub.Api.Models;

    public static class SeedData
    {
        public static void Seed(AppDbContext db)
        {
            if (db.Clients.Any()) return;

            var clients = new List<Client>
            {
                new Client
                {
                    Name = "Acme Corporation",
                    Company = "Acme",
                    Email = "info@acme.com",
                    Phone = "+359 888 123 456",
                    Notes = "Priority client with long-term contract."
                },
                new Client
                {
                    Name = "Globex Ltd",
                    Company = "Globex",
                    Email = "contact@globex.com",
                    Phone = "+359 877 654 321",
                    Notes = "Interested in enterprise integration solutions."
                },
                new Client
                {
                    Name = "Soylent Systems",
                    Company = "Soylent",
                    Email = "hello@soylent.io",
                    Phone = "+1 408 555 0111",
                    Notes = "Potential US partner; prefers asynchronous communication."
                },
                new Client
                {
                    Name = "Initech",
                    Company = "Initech",
                    Email = "support@initech.com",
                    Phone = "+44 7700 900 123",
                    Notes = "Requested product demo; medium priority."
                },
                new Client
                {
                    Name = "Umbrella Innovations",
                    Company = "Umbrella",
                    Email = "sales@umbrella.com",
                    Phone = "+359 885 777 999",
                    Notes = "Interested in SaaS pilot project."
                }
            };

            db.Clients.AddRange(clients);
            db.SaveChanges();

            var acme = clients[0];
            var globex = clients[1];
            var soylent = clients[2];
            var initech = clients[3];
            var umbrella = clients[4];

            db.Interactions.AddRange(
                // Acme
                new Interaction { ClientId = acme.Id, Type = "Call", Summary = "Kickoff call with project manager." },
                new Interaction { ClientId = acme.Id, Type = "Email", Summary = "Sent revised proposal and pricing." },
                new Interaction { ClientId = acme.Id, Type = "Meeting", Summary = "Discussed next phase roadmap." },

                // Globex
                new Interaction { ClientId = globex.Id, Type = "Email", Summary = "Initial contact and info exchange." },
                new Interaction { ClientId = globex.Id, Type = "Meeting", Summary = "Presentation of SaaS platform demo." },

                // Soylent
                new Interaction { ClientId = soylent.Id, Type = "Call", Summary = "Follow-up call after email introduction." },
                new Interaction { ClientId = soylent.Id, Type = "Email", Summary = "Shared technical documentation and API guide." },

                // Initech
                new Interaction { ClientId = initech.Id, Type = "Email", Summary = "Invited for product demo session." },
                new Interaction { ClientId = initech.Id, Type = "Meeting", Summary = "Demo scheduled via Zoom, 15:00 EET." },

                // Umbrella
                new Interaction { ClientId = umbrella.Id, Type = "Call", Summary = "Discovery call — discussed use cases." },
                new Interaction { ClientId = umbrella.Id, Type = "Email", Summary = "Sent follow-up presentation and whitepaper." }
            );

            db.SaveChanges();
        }
    }
}
