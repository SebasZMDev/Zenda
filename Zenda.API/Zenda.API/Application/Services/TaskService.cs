using Microsoft.EntityFrameworkCore;
using Zenda.Api.Application.DTOs;
using Zenda.Api.Application.Interfaces;
using Zenda.Api.Domain.Entities;
using Zenda.Api.Infrastructure.Data;
using Zenda.API.Application.DTOs;

namespace Zenda.Api.Application.Services
{
    public class TaskService : ITaskService
    {
        private readonly AppDbContext _context;

        public TaskService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TaskDto>> GetAllTasksByUserAsync(Guid userId)
        {
            var tasks = await _context.Tasks
                .Where(t => t.UserId == userId)
                .OrderBy(t => t.Order)
                .ToListAsync();

            return tasks.Select(MapToDto);
        }

        public async Task<TaskDto?> GetTaskByIdAsync(Guid taskId, Guid userId)
        {
            var task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == taskId && t.UserId == userId);

            return task != null ? MapToDto(task) : null;
        }

        public async Task<TaskDto> CreateTaskAsync(CreateTaskDto createTaskDto, Guid userId)
        {
            var task = new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = createTaskDto.Title,
                Description = createTaskDto.Description,
                StatusId = createTaskDto.StatusId,
                Order = createTaskDto.Order,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return MapToDto(task);
        }

        public async Task<TaskDto?> UpdateTaskAsync(Guid taskId, UpdateTaskDto updateTaskDto, Guid userId)
        {
            var task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == taskId && t.UserId == userId);

            if (task == null)
                return null;

            if (!string.IsNullOrEmpty(updateTaskDto.Title))
                task.Title = updateTaskDto.Title;

            if (updateTaskDto.Description != null)
                task.Description = updateTaskDto.Description;

            if (updateTaskDto.StatusId.HasValue)
                task.StatusId = updateTaskDto.StatusId.Value;

            if (updateTaskDto.Order.HasValue)
                task.Order = updateTaskDto.Order.Value;

            await _context.SaveChangesAsync();

            return MapToDto(task);
        }

        public async Task<bool> DeleteTaskAsync(Guid taskId, Guid userId)
        {
            var task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == taskId && t.UserId == userId);

            if (task == null)
                return false;

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<TaskDto>> GetTasksByStatusAsync(Guid userId, int statusId)
        {
            var tasks = await _context.Tasks
                .Where(t => t.UserId == userId && t.StatusId == statusId)
                .OrderBy(t => t.Order)
                .ToListAsync();

            return tasks.Select(MapToDto);
        }

        private TaskDto MapToDto(TaskItem task)
        {
            return new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                StatusId = task.StatusId,
                StatusName = ((Domain.Enums.TaskStatus)task.StatusId).ToString(),
                Order = task.Order,
                UserId = task.UserId,
                CreatedAt = task.CreatedAt
            };
        }


        public async Task ReorderTasksAsync(ReorderTasksDto dto, Guid userId)
        {
            var ids = dto.Tasks.Select(t => t.Id).ToList();

            var tasks = await _context.Tasks
                .Where(t => ids.Contains(t.Id) && t.UserId == userId)
                .ToListAsync();

            foreach (var task in tasks)
            {
                var updated = dto.Tasks.First(t => t.Id == task.Id);
                task.StatusId = updated.StatusId;
                task.Order = updated.Order;
            }

            await _context.SaveChangesAsync();
        }

    }
}
