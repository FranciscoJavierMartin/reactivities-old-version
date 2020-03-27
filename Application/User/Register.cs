using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Persistence;
using System;
using System.Net;
using Application.Errors;
using Microsoft.EntityFrameworkCore;
using Application.Validators;

namespace Application.User
{
  public class Register
  {
    public class Command : IRequest<User>
    {
      public string DisplayName { get; set; }
      public string Username { get; set; }
      public string Email { get; set; }
      public string Password { get; set; }
    }

    public class CommandValidator : AbstractValidator<Command>
    {
      public CommandValidator()
      {
        RuleFor(x => x.DisplayName).NotEmpty();
        RuleFor(x => x.Username).NotEmpty();
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).Password();
      }
    }

    public class Handler : IRequestHandler<Command, User>
    {
      private readonly DataContext _context;
      private readonly UserManager<AppUser> _userManager;
      private readonly IJwtGenerator _jwtGenerator;

      public Handler(DataContext context, UserManager<AppUser> userManager, IJwtGenerator jwtGenerator)
      {
        this._jwtGenerator = jwtGenerator;
        this._userManager = userManager;
        this._context = context;
      }

      public async Task<User> Handle(Command request, CancellationToken cancellationToken)
      {
        if (await _context.Users.Where(x => x.Email == request.Email).AnyAsync())
        {
          throw new RestException(HttpStatusCode.BadRequest, new { Email = "Email already exists" });
        }
        else if (await _context.Users.Where(x => x.UserName == request.Username).AnyAsync())
        {
          throw new RestException(HttpStatusCode.BadRequest, new { Username = "Username already exists" });
        }
        else
        {
          var user = new AppUser
          {
            DisplayName = request.DisplayName,
            Email = request.Email,
            UserName = request.Username,
          };

          var result = await _userManager.CreateAsync(user, request.Password);

          if (!result.Succeeded)
          {
            throw new Exception("Problem saving user");
          }
          else
          {
            return new User
            {
              DisplayName = user.DisplayName,
              Token = _jwtGenerator.CreateToken(user),
              Username = user.UserName,
              Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
            };
          }
        }

      }
    }
  }
}