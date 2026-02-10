namespace Zenda.API.Application.DTOs
{
    public class ReorderTasksDto
    {
        public List<TaskPositionDto> Tasks { get; set; } = new();
    }

    public class TaskPositionDto
    {
        public Guid Id { get; set; }
        public int StatusId { get; set; }
        public int Order { get; set; }
    }

}
