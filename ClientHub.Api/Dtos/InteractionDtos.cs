namespace ClientHub.Api.Dtos
{
    public class CreateInteractionDto
    {
        public required string Type { get; set; }
        public string? Summary { get; set; }
    }
}

