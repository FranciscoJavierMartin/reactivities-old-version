using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
  public class Create
  {
    public class Command : IRequest
    {
      public Guid Id { get; set; }
      public String Title { get; set; }
      public string Description { get; set; }
      public string Category { get; set; }
      public DateTime Date { get; set; }
      public string City { get; set; }
      public string Venue { get; set; }
    }

    public class CommandValidator : AbstractValidator<Command>
    {
      public CommandValidator()
      {
        RuleFor(x => x.Title).NotEmpty();
        RuleFor(x => x.Description).NotEmpty();
        RuleFor(x => x.Category).NotEmpty();
        RuleFor(x => x.Date).NotEmpty();
        RuleFor(x => x.City).NotEmpty();
        RuleFor(x => x.Venue).NotEmpty();
      }
    }

    public class Handler : IRequestHandler<Command>
    {
      private readonly DataContext _context;
      private readonly IUserAccessor _userAccessor;

      public Handler(DataContext context, IUserAccessor userAccessor)
      {
        this._userAccessor = userAccessor;
        this._context = context;
      }
      public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
      {
        var activity = new Activity
        {
          Id = request.Id,
          Title = request.Title,
          Category = request.Category,
          City = request.City,
          Date = request.Date,
          Description = request.Description,
          Venue = request.Venue
        };

        _context.Activities.Add(activity);

        var user = await _context.Users.SingleOrDefaultAsync(x => 
          x.UserName == _userAccessor.GetCurrentUsername());

        var attendee = new UserActivity {
          AppUser = user,
          Activity = activity,
          IsHost = true,
          DateJoined = DateTime.Now
        };

        _context.UserActivities.Add(attendee);

        var sucess = await _context.SaveChangesAsync() > 0;

        if (sucess)
        {
          return Unit.Value;
        }
        else
        {
          throw new Exception("Problem saving changes");
        }
      }
    }
  }
}