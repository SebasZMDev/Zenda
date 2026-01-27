namespace Zenda.Api.Domain.Entities
{
    public class TaskItem
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int StatusId { get; set; }
        public int Order { get; set; }
        public Guid UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        
        // Navigation property
        public User? User { get; set; }
    }
}
