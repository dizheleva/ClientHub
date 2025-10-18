namespace ClientHub.Api.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using ClientHub.Api.Models;

    [Route("api/clients/{clientId:int}/[controller]")]
    [ApiController]
    public class InteractionsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public InteractionsController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Interaction>>> GetAll(int clientId)
        {
            return await _db.Interactions
                .Where(i => i.ClientId == clientId)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Interaction>> Create(int clientId, [FromBody] Interaction i)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            i.ClientId = clientId;
            _db.Interactions.Add(i);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAll), new { clientId }, i);
        }
    }
}
