namespace ClientHub.Api.Models
{
    using System.ComponentModel.DataAnnotations;

    public class Interaction
    {
        public int Id { get; set; }
        public int ClientId { get; set; }

        [Required, StringLength(40)]
        public string Type { get; set; } = "Call"; // Call, Email, Meeting

        [StringLength(200)]
        public string? Summary { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
