using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using PetHaven.Data;
using PetHaven.Services;
using PetHaven.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Reflection;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // هذه الإعدادات تخبر الإطار بإهمال أي حقل قيمته null أثناء عمل Serialize
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

//  To allow swagger to take Tokens and enabel Authoriz button
builder.Services.AddSwaggerGen(c =>
{
    // تفعيل قراءة التعليقات والأمثلة داخل Swagger مثل تحديد قيمة البارامترات
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name        = "Authorization",
        In          = ParameterLocation.Header,
        Type        = SecuritySchemeType.ApiKey,
        Scheme      = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id   = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

//   Registring DbContext 
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("MyConnection")));
//   Registring DbContext 
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("MyConnection")));

//--------------------------------------------------------------------------------------------
// ******************** Registering Dependency Injections (DI) ***************************  : 
//--------------------------------------------------------------------------------------------

// Registering Auth services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<JwtHelper>();

// Registering Pet services
builder.Services.AddScoped<IPetService, PetService>();

// Registering PetReport services
builder.Services.AddScoped<IPetReportService, PetReportService>();

// Registering Blacklist services
builder.Services.AddScoped<IBlacklistService, BlacklistService>();

// Registering Adoption services
builder.Services.AddScoped<IAdoptionService, AdoptionService>();

// Registering Store Catalog services
builder.Services.AddScoped<IStoreCatalogService, StoreCatalogService>();

// Registering Cart services
builder.Services.AddScoped<ICartService, CartService>();

// Registering Wishlist services
builder.Services.AddScoped<IWishlistService, WishlistService>();

// Registering Order services
builder.Services.AddScoped<IOrderService, OrderService>();

// Registering ProductRating services
builder.Services.AddScoped<IProductRatingService, ProductRatingService>();

// Registering VetRating services
builder.Services.AddScoped<IVetRatingService, VetRatingService>();


// Registering Reviews (clinic feedback) services
builder.Services.AddScoped<IReviewsService, ReviewsService>();


// Registering Vet services
builder.Services.AddScoped<IVetService, VetService>();

// Registering vet Booking 
builder.Services.AddScoped<IAppointmentsService, AppointmentsService>();

// Registering Database Seeder
builder.Services.AddTransient<DatabaseSeeder>();

// إضافة HttpClient للاتصال بخدمة الـ AI
builder.Services.AddHttpClient();

// تسجيل خدمة الذكاء الاصطناعي
builder.Services.AddScoped<IRecommendationAiService, RecommendationAiService>();

// تسجيل خدمة الدفع
builder.Services.AddScoped<IPaymentService, PaymentService>();

// Registering Profile DI
builder.Services.AddScoped<IProfileService, ProfileService>();

// Registering AdopterDashboardService services
builder.Services.AddScoped<IAdopterDashboardService, AdopterDashboardService>();

// Registering Center Dashboard Service
builder.Services.AddScoped<ICenterDashboardService, CenterDashboardService>();

// Registering Center Wallet Service
builder.Services.AddScoped<ICenterWalletService, CenterWalletService>();

// Registering Vet Dashboard Service
builder.Services.AddScoped<IVetDashboardService, VetDashboardService>();

// Registering Patients Service
builder.Services.AddScoped<IPatientsService, PatientsService>();
// Registering Admin Service
builder.Services.AddScoped<IAdminService, AdminService>();

// إعدادات قراءة وتأكيد الـ Token
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        // الكود هنا يقرأ المفتاح السري من ملف appsettings.json
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"] ?? "YourSuperSecretKeyForPetHaven123456789")),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true
    };
});

var app = builder.Build();

// Run the database seeder on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await db.Database.MigrateAsync(); 

    var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
    await seeder.SeedAsync();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();

