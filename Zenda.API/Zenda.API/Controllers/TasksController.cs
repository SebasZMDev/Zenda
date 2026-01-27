using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Zenda.Api.Application.DTOs;
using Zenda.Api.Application.Interfaces;

namespace Zenda.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.Parse(userIdClaim ?? throw new UnauthorizedAccessException());
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetAllTasks()
        {
            var userId = GetUserId();
            var tasks = await _taskService.GetAllTasksByUserAsync(userId);
            return Ok(tasks);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskDto>> GetTask(Guid id)
        {
            var userId = GetUserId();
            var task = await _taskService.GetTaskByIdAsync(id, userId);

            if (task == null)
                return NotFound(new { message = "Task not found" });

            return Ok(task);
        }

        [HttpGet("status/{statusId}")]
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasksByStatus(int statusId)
        {
            if (statusId < 1 || statusId > 3)
                return BadRequest(new { message = "Invalid status id. Must be between 1 and 3." });

            var userId = GetUserId();
            var tasks = await _taskService.GetTasksByStatusAsync(userId, statusId);
            return Ok(tasks);
        }

        [HttpPost]
        public async Task<ActionResult<TaskDto>> CreateTask([FromBody] CreateTaskDto createTaskDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetUserId();
            var task = await _taskService.CreateTaskAsync(createTaskDto, userId);

            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TaskDto>> UpdateTask(Guid id, [FromBody] UpdateTaskDto updateTaskDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetUserId();
            var task = await _taskService.UpdateTaskAsync(id, updateTaskDto, userId);

            if (task == null)
                return NotFound(new { message = "Task not found" });

            return Ok(task);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTask(Guid id)
        {
            var userId = GetUserId();
            var result = await _taskService.DeleteTaskAsync(id, userId);

            if (!result)
                return NotFound(new { message = "Task not found" });

            return NoContent();
        }
    }
}
