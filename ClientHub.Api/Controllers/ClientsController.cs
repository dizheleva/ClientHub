namespace ClientHub.Api.Controllers
{
    using AutoMapper;
    using AutoMapper.QueryableExtensions;
    using ClientHub.Api.Dtos;
    using ClientHub.Api.Models;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;

    [Route("api/[controller]")]
    [ApiController]
    public class ClientsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public ClientsController(AppDbContext db, IMapper mapper)
        {
            _context = db;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<ClientDto>>> GetAll(
            [FromQuery] string? q = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string sort = "name",
            [FromQuery] string dir = "asc")
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 10;

            var query = _context.Clients.AsNoTracking().AsQueryable();

            // Search
            if (!string.IsNullOrWhiteSpace(q))
            {
                var l = q.ToLower();
                query = query.Where(c =>
                    c.Name.ToLower().Contains(l) ||
                    (c.Company != null && c.Company.ToLower().Contains(l)) ||
                    (c.Email != null && c.Email.ToLower().Contains(l)) ||
                    (c.Phone != null && c.Phone.ToLower().Contains(l)));
            }

            // Sort (whitelist for safety)
            bool asc = dir.Equals("asc", StringComparison.OrdinalIgnoreCase);
            query = sort.ToLower() switch
            {
                "email" => (asc ? query.OrderBy(c => c.Email) : query.OrderByDescending(c => c.Email)),
                "company" => (asc ? query.OrderBy(c => c.Company) : query.OrderByDescending(c => c.Company)),
                "phone" => (asc ? query.OrderBy(c => c.Phone) : query.OrderByDescending(c => c.Phone)),
                "name" or _ => (asc ? query.OrderBy(c => c.Name) : query.OrderByDescending(c => c.Name)),
            };

            var total = await query.CountAsync();
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ProjectTo<ClientDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            var result = new PagedResult<ClientDto>
            {
                Items = items,
                Total = total,
                Page = page,
                PageSize = pageSize
            };

            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ClientDto>> Get(int id)
        {
            var client = await _context.Clients
                .Include(c => c.Interactions)
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == id);

            return client is null ? NotFound() : Ok(_mapper.Map<ClientDto>(client));
        }

        [HttpPost]
        public async Task<ActionResult<ClientDto>> Create([FromBody] CreateClientDto dto)
        {
            var entity = _mapper.Map<Client>(dto);

            _context.Clients.Add(entity);
            await _context.SaveChangesAsync();

            var result = _mapper.Map<ClientDto>(entity);
            return CreatedAtAction(nameof(Get), new { id = entity.Id }, result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateClientDto dto)
        {
            var c = await _context.Clients.FindAsync(id);
            if (c is null) return NotFound();

            _mapper.Map(dto, c);

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var c = await _context.Clients.FindAsync(id);
            if (c is null) return NotFound();

            _context.Clients.Remove(c);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
