using Microsoft.EntityFrameworkCore;
using PetHaven.Models;

namespace PetHaven.Data
{
    public class DatabaseSeeder
    {
        private readonly ApplicationDbContext _context;

        public DatabaseSeeder(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task SeedAsync()
        {
            // Guard: if vet ratings are already seeded, there is no need to repeat the whole seed.
            // This avoids skipping the ratings section when the database already contains other seed data.
            if (await _context.Ratings.AnyAsync(r => r.TargetType == "Vet")) return;

            // =========================================================
            // 1. Roles
            // =========================================================
            var roleAdopter        = await EnsureRoleAsync("Adopter");
            var roleCenter         = await EnsureRoleAsync("AdoptionCenter");
            var roleVet            = await EnsureRoleAsync("Vet");
            var roleAdmin   = await EnsureRoleAsync("Admin");
            await _context.SaveChangesAsync();

            // =========================================================
            // 2. Users  (passwords hashed with BCrypt)
            // =========================================================

            // --- Adopter user ---
            var adopterUser = new User
            {
                RoleId      = roleAdopter.RoleId,
                UserName    = "john_adopter",
                FullName    = "John Smith",
                Email       = "john.adopter@pethaven.com",
                Password    = BCrypt.Net.BCrypt.HashPassword("Adopter@123"),
                PhoneNumber = "+1-555-0101"
            };

            // --- Adoption Center user ---
            var centerUser = new User
            {
                RoleId      = roleCenter.RoleId,
                UserName    = "happy_paws_center",
                FullName    = "Happy Paws Adoption Center",
                Email       = "contact@happypaws.com",
                Password    = BCrypt.Net.BCrypt.HashPassword("Center@123"),
                PhoneNumber = "+1-555-0202"
            };

            // --- Vet user ---
            var vetUser = new User
            {
                RoleId      = roleVet.RoleId,
                UserName    = "dr_sarah_vet",
                FullName    = "Dr. Sarah Johnson",
                Email       = "sarah.johnson@pethaven.com",
                Password    = BCrypt.Net.BCrypt.HashPassword("Vet@123"),
                PhoneNumber = "+1-555-0303"
            };

            await _context.Users.AddRangeAsync(adopterUser, centerUser, vetUser);
            await _context.SaveChangesAsync();

            // =========================================================
            // 3. Profile records (use generated UserIds)
            // =========================================================

            // Adopter profile
            var adopterProfile = new Adopter
            {
                UserId           = adopterUser.UserId,
                Address          = "123 Maple Street, Springfield, IL 62701",
                HousingType      = "House",
                HasPetBefore     = true,
                ExperienceLevel  = "Intermediate",
                MissedReportsCount = 0,
                Balance          = 500.00m
            };

            // Cart for the adopter
            var adopterCart = new Cart
            {
                UserId    = adopterUser.UserId,
                CreatedAt = DateTime.UtcNow
            };

            // Adoption Center profile
            var centerProfile = new AdoptionCenter
            {
                UserId      = centerUser.UserId,
                CenterName  = "Happy Paws Adoption Center",
                Address     = "456 Oak Avenue, Chicago, IL 60601",
                ContactInfo = "contact@happypaws.com | +1-555-0202"
            };

            // Vet profile
            var vetProfile = new Vet
            {
                UserId          = vetUser.UserId,
                FullName        = "Dr. Sarah Johnson",
                Specialization  = "Small Animal Medicine",
                ClinicName      = "PetCare Veterinary Clinic",
                ClinicAddress   = "789 Elm Road, Chicago, IL 60602",
                PhoneNumber     = "+1-555-0303",
                Email           = "sarah.johnson@pethaven.com",
                ExperienceYears = 8,
                LicenseNumber   = "VET-IL-2024-00123",
                Location_Lat    = 33.513972m,
                Location_Lng    = 36.276537m,
                IsVerified      = true,
                CreatedAt       = DateTime.UtcNow
            };

            await _context.Adopters.AddAsync(adopterProfile);
            await _context.Carts.AddAsync(adopterCart);
            await _context.AdoptionCenters.AddAsync(centerProfile);
            await _context.Vets.AddAsync(vetProfile);
            await _context.SaveChangesAsync();

            // =========================================================
            // 4. Categories
            // =========================================================
            var catFood = new Category
            {
                CategoryName = "Food",
                Description  = "Nutritious meals and treats for all pet types.",
                ImageURL     = "https://placehold.co/200x200?text=Food"
            };
            var catToys = new Category
            {
                CategoryName = "Toys",
                Description  = "Fun and engaging toys to keep pets active.",
                ImageURL     = "https://placehold.co/200x200?text=Toys"
            };
            var catMedicine = new Category
            {
                CategoryName = "Medicine",
                Description  = "Health supplements, vitamins, and medication.",
                ImageURL     = "https://placehold.co/200x200?text=Medicine"
            };
            var catAccessories = new Category
            {
                CategoryName = "Accessories",
                Description  = "Collars, leashes, beds, and grooming supplies.",
                ImageURL     = "https://placehold.co/200x200?text=Accessories"
            };

            await _context.Categories.AddRangeAsync(catFood, catToys, catMedicine, catAccessories);
            await _context.SaveChangesAsync();

            // =========================================================
            // 5. Products  (linked to center + categories)
            // =========================================================
            var products = new List<Product>
            {
                new Product
                {
                    CenterId      = centerProfile.CenterId,
                    CategoryId    = catFood.CategoryId,
                    Name          = "Premium Dog Kibble (5 kg)",
                    Description   = "High-protein dry food formulated for adult dogs of all breeds.",
                    ProductPrice  = 34.99m,
                    DiscountRate  = 0.05m,
                    StockQuantity = 80,
                    ImageURL      = "https://placehold.co/300x300?text=DogKibble"
                },
                new Product
                {
                    CenterId      = centerProfile.CenterId,
                    CategoryId    = catFood.CategoryId,
                    Name          = "Gourmet Wet Cat Food (24-pack)",
                    Description   = "Grain-free pâté with real tuna for adult cats.",
                    ProductPrice  = 27.49m,
                    DiscountRate  = 0.00m,
                    StockQuantity = 60,
                    ImageURL      = "https://placehold.co/300x300?text=CatFood"
                },
                new Product
                {
                    CenterId      = centerProfile.CenterId,
                    CategoryId    = catToys.CategoryId,
                    Name          = "Interactive Rope Tug Toy",
                    Description   = "Durable braided rope toy ideal for fetch and tug-of-war.",
                    ProductPrice  = 9.99m,
                    DiscountRate  = 0.10m,
                    StockQuantity = 150,
                    ImageURL      = "https://placehold.co/300x300?text=RopeToy"
                },
                new Product
                {
                    CenterId      = centerProfile.CenterId,
                    CategoryId    = catToys.CategoryId,
                    Name          = "Feather Wand Cat Teaser",
                    Description   = "Retractable wand with colourful feather attachment for cats.",
                    ProductPrice  = 7.49m,
                    DiscountRate  = 0.00m,
                    StockQuantity = 120,
                    ImageURL      = "https://placehold.co/300x300?text=Feather"
                },
                new Product
                {
                    CenterId      = centerProfile.CenterId,
                    CategoryId    = catMedicine.CategoryId,
                    Name          = "Omega-3 Fish Oil Supplements (90 caps)",
                    Description   = "Supports coat health, joint function, and immune system in dogs and cats.",
                    ProductPrice  = 19.99m,
                    DiscountRate  = 0.00m,
                    StockQuantity = 200,
                    ImageURL      = "https://placehold.co/300x300?text=Omega3"
                },
                new Product
                {
                    CenterId      = centerProfile.CenterId,
                    CategoryId    = catAccessories.CategoryId,
                    Name          = "Adjustable Nylon Dog Collar (Medium)",
                    Description   = "Lightweight, waterproof collar with quick-release buckle.",
                    ProductPrice  = 12.99m,
                    DiscountRate  = 0.15m,
                    StockQuantity = 95,
                    ImageURL      = "https://placehold.co/300x300?text=Collar"
                }
            };

            await _context.Products.AddRangeAsync(products);
            await _context.SaveChangesAsync();

            // =========================================================
            // 6. Pets  (linked to center)
            // =========================================================
            var pets = new List<Pet>
            {
                new Pet
                {
                    CenterId     = centerProfile.CenterId,
                    PetName      = "Buddy",
                    Species      = "Dog",
                    Breed        = "Golden Retriever",
                    Age          = 2,
                    Gender       = "Male",
                    HealthStatus = "Healthy",
                    Description  = "Friendly and energetic golden retriever who loves to play fetch.",
                    ImageURL     = "https://placehold.co/400x400?text=Buddy"
                },
                new Pet
                {
                    CenterId     = centerProfile.CenterId,
                    PetName      = "Luna",
                    Species      = "Cat",
                    Breed        = "Siamese",
                    Age          = 3,
                    Gender       = "Female",
                    HealthStatus = "Healthy",
                    Description  = "Elegant Siamese cat with striking blue eyes. Very affectionate.",
                    ImageURL     = "https://placehold.co/400x400?text=Luna"
                },
                new Pet
                {
                    CenterId     = centerProfile.CenterId,
                    PetName      = "Max",
                    Species      = "Dog",
                    Breed        = "German Shepherd",
                    Age          = 4,
                    Gender       = "Male",
                    HealthStatus = "Healthy",
                    Description  = "Intelligent and loyal German Shepherd, well-trained and great with kids.",
                    ImageURL     = "https://placehold.co/400x400?text=Max"
                },
                new Pet
                {
                    CenterId     = centerProfile.CenterId,
                    PetName      = "Bella",
                    Species      = "Cat",
                    Breed        = "Persian",
                    Age          = 1,
                    Gender       = "Female",
                    HealthStatus = "Healthy",
                    Description  = "Fluffy Persian kitten with a playful personality.",
                    ImageURL     = "https://placehold.co/400x400?text=Bella"
                },
                new Pet
                {
                    CenterId     = centerProfile.CenterId,
                    PetName      = "Charlie",
                    Species      = "Dog",
                    Breed        = "Beagle",
                    Age          = 5,
                    Gender       = "Male",
                    HealthStatus = "Healthy",
                    Description  = "Curious and gentle Beagle, great with families and other dogs.",
                    ImageURL     = "https://placehold.co/400x400?text=Charlie"
                },
                new Pet
                {
                    CenterId     = centerProfile.CenterId,
                    PetName      = "Mango",
                    Species      = "Rabbit",
                    Breed        = "Holland Lop",
                    Age          = 1,
                    Gender       = "Male",
                    HealthStatus = "Healthy",
                    Description  = "Adorable Holland Lop rabbit with floppy ears and a calm temperament.",
                    ImageURL     = "https://placehold.co/400x400?text=Mango"
                }
            };

await _context.Pets.AddRangeAsync(pets);
            await _context.SaveChangesAsync();

            // =========================================================
            // 7. Appointments (مواعيد اليوم للوحة تحكم العيادة)
            // =========================================================
            var today = DateTime.Today;
            var appointments = new List<Appointment>
            {
                // موعد قيد الانتظار (Pending)
                new Appointment
                {
                    AdopterId      = adopterProfile.AdopterId,
                    PetId          = pets[0].PetId, // Buddy
                    VetId          = vetProfile.VetId,
                    AppointmentDate = today.AddHours(9),
                    Status         = "Pending",
                    Reason         = "فحص دوري وتطعيمات"
                },
                // موعد مؤكد (Confirmed)
                new Appointment
                {
                    AdopterId      = adopterProfile.AdopterId,
                    PetId          = pets[1].PetId, // Luna
                    VetId          = vetProfile.VetId,
                    AppointmentDate = today.AddHours(10).AddMinutes(30),
                    Status         = "Confirmed",
                    Reason         = "تنظيف الأسنان"
                },
                // موعد مؤكد (Confirmed)
                new Appointment
                {
                    AdopterId      = adopterProfile.AdopterId,
                    PetId          = pets[4].PetId, // Charlie
                    VetId          = vetProfile.VetId,
                    AppointmentDate = today.AddHours(13).AddMinutes(15),
                    Status         = "Confirmed",
                    Reason         = "فحص العرج المفاجئ"
                },
                // موعد مكتمل (Completed)
                new Appointment
                {
                    AdopterId      = adopterProfile.AdopterId,
                    PetId          = pets[3].PetId, // Bella
                    VetId          = vetProfile.VetId,
                    AppointmentDate = today.AddHours(8),
                    Status         = "Completed",
                    Reason         = "متابعة ما بعد العملية"
                },
                // موعد ملغي (Cancelled)
                new Appointment
                {
                    AdopterId      = adopterProfile.AdopterId,
                    PetId          = pets[2].PetId, // Max
                    VetId          = vetProfile.VetId,
                    AppointmentDate = today.AddHours(11),
                    Status         = "Cancelled",
                    Reason         = "إلغاء من قبل صاحب الحيوان"
                }
            };

            await _context.Appointments.AddRangeAsync(appointments);
            await _context.SaveChangesAsync();

            // =========================================================
            // 8. Ratings — تقييمات الأطباء (تقييمات الطبيب الحالي)
            //    تُستخدم في صفحة Client Reviews الخاصة بلوحة الطبيب
            // =========================================================

            // --- مستخدمون إضافيون (مربّون) لتقييم الطبيب ---
            var sarahUser = new User
            {
                RoleId      = roleAdopter.RoleId,
                UserName    = "sarah_j",
                FullName    = "Sarah J.",
                Email       = "sarah.j@pethaven.com",
                Password    = BCrypt.Net.BCrypt.HashPassword("Adopter@123"),
                PhoneNumber = "+1-555-0404"
            };
            var markUser = new User
            {
                RoleId      = roleAdopter.RoleId,
                UserName    = "mark_p",
                FullName    = "Mark P.",
                Email       = "mark.p@pethaven.com",
                Password    = BCrypt.Net.BCrypt.HashPassword("Adopter@123"),
                PhoneNumber = "+1-555-0505"
            };
            var lindaUser = new User
            {
                RoleId      = roleAdopter.RoleId,
                UserName    = "linda_t",
                FullName    = "Linda T.",
                Email       = "linda.t@pethaven.com",
                Password    = BCrypt.Net.BCrypt.HashPassword("Adopter@123"),
                PhoneNumber = "+1-555-0606"
            };
            var omarUser = new User
            {
                RoleId      = roleAdopter.RoleId,
                UserName    = "omar_k",
                FullName    = "Omar K.",
                Email       = "omar.k@pethaven.com",
                Password    = BCrypt.Net.BCrypt.HashPassword("Adopter@123"),
                PhoneNumber = "+1-555-0707"
            };
            var emilyUser = new User
            {
                RoleId      = roleAdopter.RoleId,
                UserName    = "emily_r",
                FullName    = "Emily R.",
                Email       = "emily.r@pethaven.com",
                Password    = BCrypt.Net.BCrypt.HashPassword("Adopter@123"),
                PhoneNumber = "+1-555-0808"
            };

            await _context.Users.AddRangeAsync(sarahUser, markUser, lindaUser, omarUser, emilyUser);
            await _context.SaveChangesAsync();

            // --- ملفات المربّين (Adopter profiles) ---
            var sarahProfile = new Adopter { UserId = sarahUser.UserId, HousingType = "House", HasPetBefore = true, Balance = 120.00m };
            var markProfile  = new Adopter { UserId = markUser.UserId,  HousingType = "Apartment", HasPetBefore = true, Balance = 80.00m };
            var lindaProfile = new Adopter { UserId = lindaUser.UserId, HousingType = "House", HasPetBefore = true, Balance = 200.00m };
            var omarProfile  = new Adopter { UserId = omarUser.UserId,  HousingType = "Apartment", HasPetBefore = true, Balance = 60.00m };
            var emilyProfile = new Adopter { UserId = emilyUser.UserId, HousingType = "House", HasPetBefore = false, Balance = 150.00m };

            await _context.Adopters.AddRangeAsync(sarahProfile, markProfile, lindaProfile, omarProfile, emilyProfile);
            await _context.SaveChangesAsync();

            // --- تقييمات الطبيب الحالي (TargetType = "Vet", TargetId = vetProfile.VetId) ---
            var ratings = new List<Rating>
            {
                new Rating
                {
                    UserId      = sarahUser.UserId,
                    TargetType  = "Vet",
                    TargetId    = vetProfile.VetId,
                    StarsCount  = 5,
                    ReviewText  = "Absolutely wonderful experience! Dr. Smith was so patient with Daisy during her annual checkup. The staff is always friendly and the clinic is spotless. Highly recommend Pet Haven to anyone looking for compassionate care.",
                    CreatedAt   = DateTime.UtcNow.AddDays(-3)
                },
                new Rating
                {
                    UserId      = markUser.UserId,
                    TargetType  = "Vet",
                    TargetId    = vetProfile.VetId,
                    StarsCount  = 4,
                    ReviewText  = "Great care for my dog, but we did have to wait about 20 minutes past our appointment time before being seen. Once in the room, everything went smoothly.",
                    CreatedAt   = DateTime.UtcNow.AddDays(-7)
                },
                new Rating
                {
                    UserId      = lindaUser.UserId,
                    TargetType  = "Vet",
                    TargetId    = vetProfile.VetId,
                    StarsCount  = 5,
                    ReviewText  = "I wouldn't trust anyone else with Bella. The team here always goes above and beyond.",
                    CreatedAt   = DateTime.UtcNow.AddDays(-12)
                },
                new Rating
                {
                    UserId      = omarUser.UserId,
                    TargetType  = "Vet",
                    TargetId    = vetProfile.VetId,
                    StarsCount  = 5,
                    ReviewText  = "Very professional and caring. They explained everything clearly and my cat felt at ease.",
                    CreatedAt   = DateTime.UtcNow.AddDays(-15)
                },
                new Rating
                {
                    UserId      = emilyUser.UserId,
                    TargetType  = "Vet",
                    TargetId    = vetProfile.VetId,
                    StarsCount  = 4,
                    ReviewText  = "Great experience overall. The vet was knowledgeable and took time to answer all my questions.",
                    CreatedAt   = DateTime.UtcNow.AddDays(-20)
                },
                // تقييم بدون نص (يُعتبر "غير مُجاب عنه" Unanswered)
                new Rating
                {
                    UserId      = adopterUser.UserId,
                    TargetType  = "Vet",
                    TargetId    = vetProfile.VetId,
                    StarsCount  = 5,
                    ReviewText  = null,
                    CreatedAt   = DateTime.UtcNow.AddDays(-1)
                }
            };

            await _context.Ratings.AddRangeAsync(ratings);
            await _context.SaveChangesAsync();
        }

        // =========================================================
        // Helper: ensure a Role exists, return it (create if missing)
        // =========================================================
        private async Task<Role> EnsureRoleAsync(string roleName)
        {
            var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == roleName);
            if (role == null)
            {
                role = new Role { RoleName = roleName };
                await _context.Roles.AddAsync(role);
            }
            return role;
        }
    }
}
