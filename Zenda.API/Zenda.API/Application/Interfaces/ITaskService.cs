using Zenda.Api.Application.DTOs;

namespace Zenda.Api.Application.Interfaces
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskDto>> GetAllTasksByUserAsync(Guid userId);
        Task<TaskDto?> GetTaskByIdAsync(Guid taskId, Guid userId);
        Task<TaskDto> CreateTaskAsync(CreateTaskDto createTaskDto, Guid userId);
        Task<TaskDto?> UpdateTaskAsync(Guid taskId, UpdateTaskDto updateTaskDto, Guid userId);
        Task<bool> DeleteTaskAsync(Guid taskId, Guid userId);
        Task<IEnumerable<TaskDto>> GetTasksByStatusAsync(Guid userId, int statusId);
    }
}
