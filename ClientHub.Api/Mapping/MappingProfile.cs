namespace ClientHub.Api.Mapping
{
    using AutoMapper;
    using ClientHub.Api.Dtos;
    using ClientHub.Api.Models;

    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Client, ClientDto>();
            CreateMap<CreateClientDto, Client>();
            CreateMap<UpdateClientDto, Client>();
        }
    }
}
