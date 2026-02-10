using Zenda.Api.Application.DTOs;

namespace Zenda.Api.Application.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResult?> LoginAsync(string email, string password);
        Task<AuthResult?> RegisterAsync(string email, string password);
        Task<AuthResult?> RefreshAsync(string refreshToken);
        Task LogoutAsync(string refreshToken);
        Task<bool> UserExistsAsync(string email);
    }
}
