namespace ClientHub.Api.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using ClientHub.Api.Models;
    using ClientHub.Api.Dtos;

    [Route("api/clients/{clientId:int}/[controller]")]
    [ApiController]
    public class InteractionsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public InteractionsController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Interaction>>> GetAll(int clientId)
        {
            // Verify client exists
            var clientExists = await _db.Clients.AnyAsync(c => c.Id == clientId);
            if (!clientExists) return NotFound();

            return await _db.Interactions
                .Where(i => i.ClientId == clientId)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Interaction>> Create(int clientId, [FromBody] CreateInteractionDto dto)
        {
            // Verify client exists
            var clientExists = await _db.Clients.AnyAsync(c => c.Id == clientId);
            if (!clientExists) return NotFound();

            var interaction = new Interaction
            {
                ClientId = clientId,
                Type = dto.Type,
                Summary = dto.Summary,
                CreatedAt = DateTime.UtcNow
            };

            _db.Interactions.Add(interaction);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAll), new { clientId }, interaction);
        }
    }
}
