using System.ComponentModel.DataAnnotations;

namespace Zenda.Api.Application.DTOs
{
    public class UpdateTaskDto
    {
        [StringLength(150)]
        public string? Title { get; set; }
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        [Range(1, 3)]
        public int? StatusId { get; set; }
        
        public int? Order { get; set; }
    }
}
