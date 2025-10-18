namespace ClientHub.Api.Controllers
{
    using ClientHub.Api.Models;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;

    [Route("api/[controller]")]
    [ApiController]
    public class ClientsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public ClientsController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Client>>> GetAll([FromQuery] string? q = null)
        {
            var query = _db.Clients.AsNoTracking().AsQueryable();
            if (!string.IsNullOrWhiteSpace(q))
            {
                var l = q.ToLower();
                query = query.Where(c =>
                    c.Name.ToLower().Contains(l) ||
                    (c.Company != null && c.Company.ToLower().Contains(l)) ||
                    (c.Email != null && c.Email.ToLower().Contains(l)));
            }
            return Ok(await query
                .OrderBy(c => c.Name)
                .ToListAsync());
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Client>> Get(int id)
        {
            var client = await _db.Clients.Include(c => c.Interactions)
                .FirstOrDefaultAsync(c => c.Id == id);
            return client is null ? NotFound() : Ok(client);
        }

        [HttpPost]
        public async Task<ActionResult<Client>> Create([FromBody] Client c)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            _db.Clients.Add(c);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = c.Id }, c);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] Client update)
        {
            var c = await _db.Clients.FindAsync(id);
            if (c is null) return NotFound();
            c.Name = update.Name; c.Email = update.Email; c.Company = update.Company; c.Notes = update.Notes;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var c = await _db.Clients.FindAsync(id);
            if (c is null) return NotFound();
            _db.Clients.Remove(c);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
