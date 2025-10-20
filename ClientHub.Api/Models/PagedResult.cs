namespace ClientHub.Api.Models
{
    public class PagedResult<T>
    {
        public int Total { get; set; }
        public int PageSize { get; set; }
        public int Page { get; set; }
        public required IEnumerable<T> Items { get; set; } = new List<T>();
    }
}
