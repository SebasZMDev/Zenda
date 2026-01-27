using System.ComponentModel.DataAnnotations;

namespace Zenda.Api.Application.DTOs
{
    public class CreateTaskDto
    {
        [Required]
        [StringLength(150)]
        public string Title { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        [Required]
        [Range(1, 3)]
        public int StatusId { get; set; }
        
        [Required]
        public int Order { get; set; }
    }
}
