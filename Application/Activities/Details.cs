using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
  public class Details
  {
    public class Query : IRequest<ActivityDto>
    {
      public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Query, ActivityDto>
    {
      private readonly IMapper _mapper;
      private readonly DataContext _context;
      public Handler(DataContext context, IMapper mapper)
      {
        this._mapper = mapper;
        this._context = context;
      }

      public async Task<ActivityDto> Handle(Query request, CancellationToken cancellationToken)
      {

        var activity = await _context.Activities
          .FindAsync(request.Id);

        if (activity == null)
        {
          throw new RestException(HttpStatusCode.NotFound, new { activity = "Not found" });
        }

        var activityDto = new ActivityDto {
          Id= activity.Id,
          Title = activity.Title,
          Description = activity.Description,
          Category = activity.Category,
          City = activity.City,
          Date = activity.Date,
          Venue = activity.Venue,
          //UserActivities = activity.UserActivities
        };
        
        return _mapper.Map<Activity, ActivityDto>(activity);
      }
    }
  }
}