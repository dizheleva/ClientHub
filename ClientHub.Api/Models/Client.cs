namespace ClientHub.Api.Models
{
    using System.ComponentModel.DataAnnotations;

    public class Client
    {
        public int Id { get; set; }

        [Required, StringLength(120)]
        public string Name { get; set; } = string.Empty;

        [StringLength(120), EmailAddress]
        public string? Email { get; set; }

        [StringLength(20), Phone]
        public string? Phone { get; set; } = string.Empty;

        [StringLength(120)]
        public string? Company { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }

        public List<Interaction> Interactions { get; set; } = new();
    }
}
