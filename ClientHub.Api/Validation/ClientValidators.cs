namespace ClientHub.Api.Validation
{
    using ClientHub.Api.Dtos;
    using FluentValidation;

    public static class ClientValidationRules
    {
        public static void ApplyCommonRules<T>(AbstractValidator<T> validator)
            where T : class
        {
            validator.RuleForProperty("Name", 120, true);
            validator.RuleForProperty("Email", 120, false, email: true);
            validator.RuleForProperty("Phone", 20, false, phone: true);
            validator.RuleForProperty("Company", 120);
            validator.RuleForProperty("Notes", 500);
        }

        private static void RuleForProperty<T>(
            this AbstractValidator<T> validator,
            string prop,
            int maxLen,
            bool required = false,
            bool email = false,
            bool phone = false)
        {
            var propertyInfo = typeof(T).GetProperty(prop);

            var rule = validator.RuleFor(x => (string?)propertyInfo.GetValue(x));

            if (required)
                rule.NotEmpty().WithMessage($"{prop} is required.");

            if (email)
                rule.EmailAddress().WithMessage("Invalid email format.");

            if (phone)
                rule.Matches(@"^[\d\+\-\s\(\)]*$").WithMessage("Phone may contain digits, +, -, space and parentheses only.");

            rule.MaximumLength(maxLen);
        }
    }

    public class CreateClientDtoValidator : AbstractValidator<CreateClientDto>
    {
        public CreateClientDtoValidator() => ClientValidationRules.ApplyCommonRules(this);
    }

    public class UpdateClientDtoValidator : AbstractValidator<UpdateClientDto>
    {
        public UpdateClientDtoValidator() => ClientValidationRules.ApplyCommonRules(this);
    }

    public class CreateInteractionDtoValidator : AbstractValidator<CreateInteractionDto>
    {
        public CreateInteractionDtoValidator()
        {
            RuleFor(x => x.Type)
                .NotEmpty().WithMessage("Type is required.")
                .MaximumLength(40).WithMessage("Type must not exceed 40 characters.")
                .Must(t => new[] { "Call", "Email", "Meeting" }.Contains(t))
                .WithMessage("Type must be one of: Call, Email, Meeting.");

            RuleFor(x => x.Summary)
                .MaximumLength(200).WithMessage("Summary must not exceed 200 characters.");
        }
    }
}
