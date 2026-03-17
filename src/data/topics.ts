export const topics = [
  {
    id: 1,
    title: "Kiến trúc 3 Lớp & Vai trò của Model",
    subtitle: "3-Layer Architecture & Models",
    description: "Kiến trúc 3 lớp giúp phân tách trách nhiệm rõ ràng trong ứng dụng Web API, giúp dễ bảo trì và mở rộng.",
    diagram: `
graph TD
    Client([Client / Browser])
    
    subgraph "Web API Application"
        PL[Presentation Layer<br/>Controllers]
        BLL[Business Logic Layer<br/>Services]
        DAL[Data Access Layer<br/>EF Core]
    end
    
    DB[(Database)]
    
    Client <-->|HTTP Request/Response| PL
    PL <-->|DTOs| BLL
    BLL <-->|Entity Models| DAL
    DAL <-->|SQL Queries| DB
    
    classDef default fill:#1e293b,stroke:#475569,stroke-width:2px,color:#f8fafc;
    classDef layer fill:#0f172a,stroke:#334155,stroke-width:2px;
    classDef db fill:#1e1b4b,stroke:#3730a3,stroke-width:2px;
    classDef client fill:#312e81,stroke:#4f46e5,stroke-width:2px;
    
    class PL,BLL,DAL layer;
    class DB db;
    class Client client;
    `,
    points: [
      {
        title: "Presentation Layer (MVC/API)",
        content: "Xử lý HTTP requests và responses. Giao tiếp trực tiếp với người dùng hoặc ứng dụng client."
      },
      {
        title: "Business Logic Layer",
        content: "Chứa logic nghiệp vụ cốt lõi. Xử lý các quy tắc kinh doanh và tính toán."
      },
      {
        title: "Data Access Layer",
        content: "Tương tác với cơ sở dữ liệu (CRUD) thông qua EF Core. Chịu trách nhiệm lưu trữ và truy xuất dữ liệu."
      },
      {
        title: "Vai trò của Model",
        content: "Đại diện cho dữ liệu đặc thù của domain và logic nghiệp vụ. Trong ASP.NET Core, Models là các class C# định hình cấu trúc dữ liệu."
      }
    ],
    codeSnippet: `// 1. Presentation Layer (Controller)
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase 
{
    private readonly IUserService _userService;
    
    public UsersController(IUserService userService) 
    {
        _userService = userService;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(int id) 
    {
        var user = await _userService.GetUserByIdAsync(id);
        if (user == null) return NotFound();
        return Ok(user);
    }
}

// 2. Business Logic Layer (Service)
public class UserService : IUserService 
{
    private readonly AppDbContext _context;
    
    public UserService(AppDbContext context) 
    {
        _context = context;
    }

    public async Task<UserDto> GetUserByIdAsync(int id) 
    {
        // Gọi Data Access Layer (EF Core) để lấy dữ liệu
        var user = await _context.Users.FindAsync(id);
        
        // Xử lý logic nghiệp vụ (nếu có)
        // ...
        
        return MapToDto(user); 
    }
}`
  },
  {
    id: 2,
    title: "Chiến lược truy cập dữ liệu với EF Core",
    subtitle: "Data Access Strategy",
    description: "Entity Framework Core là một ORM (Object Relational Mapping) giúp lập trình viên C# làm việc với database thông qua các object thay vì viết SQL thuần.",
    diagram: `
graph LR
    subgraph "Code-First Approach"
        CF_M[Entity Models<br/>C# Classes] -->|1. EF Core Migrations| CF_DB[(Database)]
        CF_DB -.->|2. Create/Update Schema| CF_DB
    end
    
    subgraph "Database-First Approach"
        DF_DB[(Database)] -->|1. EF Core Scaffold| DF_M[Entity Models<br/>C# Classes]
        DF_M -.->|2. Generate Code| DF_M
    end
    
    classDef default fill:#1e293b,stroke:#475569,stroke-width:2px,color:#f8fafc;
    classDef model fill:#064e3b,stroke:#059669,stroke-width:2px;
    classDef db fill:#1e1b4b,stroke:#3730a3,stroke-width:2px;
    
    class CF_M,DF_M model;
    class CF_DB,DF_DB db;
    `,
    points: [
      {
        title: "ORM (Object Relational Mapping)",
        content: "Giúp xây dựng ứng dụng nhanh chóng bằng cách làm việc với các object .NET thay vì tương tác trực tiếp với schema database."
      },
      {
        title: "Code-First Workflow",
        content: "Viết các class C# (Entity Models) trước, sau đó dùng EF Core Migrations để tạo database tương ứng. Phù hợp khi xây dựng ứng dụng từ đầu và yêu cầu thay đổi liên tục."
      },
      {
        title: "Database-First Workflow",
        content: "Có sẵn database, dùng lệnh Scaffold để tạo ra các class C# (Entity Models). Phù hợp khi database đã được thiết kế sẵn hoặc do team quản trị CSDL quản lý."
      }
    ],
    codeSnippet: `// 1. Entity Model (Đại diện cho 1 bảng trong Database)
public class Product 
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
}

// 2. Database Context (Đại diện cho toàn bộ Database)
public class AppDbContext : DbContext 
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) 
    { 
    }

    // DbSet đại diện cho bảng Products
    public DbSet<Product> Products { get; set; }

    // Cấu hình thêm bằng Fluent API (Tùy chọn)
    protected override void OnModelCreating(ModelBuilder modelBuilder) 
    {
        modelBuilder.Entity<Product>()
            .Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(100);
    }
}`
  },
  {
    id: 3,
    title: "Tối ưu hóa API với DTO & AutoMapper",
    subtitle: "API Surface & Decoupling",
    description: "Sử dụng DTO (Data Transfer Object) để tách biệt dữ liệu trả về cho client khỏi cấu trúc database thực tế.",
    diagram: `
graph TD
    Client([Client])
    
    subgraph "API Endpoint (Controller)"
        ReqDTO[Request DTO]
        ResDTO[Response DTO]
    end
    
    subgraph "Service Layer"
        Mapper1{AutoMapper}
        Mapper2{AutoMapper}
        Entity1[Entity Model]
        Entity2[Entity Model]
    end
    
    DB[(Database)]
    
    Client -->|1. POST JSON| ReqDTO
    ReqDTO -->|2. Map| Mapper1
    Mapper1 -->|3. To| Entity1
    Entity1 -->|4. Save| DB
    
    DB -->|5. Retrieve| Entity2
    Entity2 -->|6. Map| Mapper2
    Mapper2 -->|7. To| ResDTO
    ResDTO -->|8. GET JSON| Client
    
    classDef default fill:#1e293b,stroke:#475569,stroke-width:2px,color:#f8fafc;
    classDef client fill:#312e81,stroke:#4f46e5,stroke-width:2px;
    classDef dto fill:#7c2d12,stroke:#ea580c,stroke-width:2px;
    classDef mapper fill:#4c1d95,stroke:#8b5cf6,stroke-width:2px;
    classDef entity fill:#064e3b,stroke:#059669,stroke-width:2px;
    classDef db fill:#1e1b4b,stroke:#3730a3,stroke-width:2px;
    
    class Client client;
    class ReqDTO,ResDTO dto;
    class Mapper1,Mapper2 mapper;
    class Entity1,Entity2 entity;
    class DB db;
    `,
    points: [
      {
        title: "Data Transfer Objects (DTOs)",
        content: "Là các class định nghĩa dữ liệu cho HTTP requests và responses. Giống như ViewModels trong MVC, chỉ hiển thị dữ liệu liên quan cho client."
      },
      {
        title: "Decoupling (Tách biệt)",
        content: "Tách DTO khỏi Entity Model. Khi cấu trúc database thay đổi, API contract với client không bị phá vỡ. Entity Model chỉ dùng cho database."
      },
      {
        title: "AutoMapper",
        content: "Thư viện giúp tự động ánh xạ (map) dữ liệu giữa DTO và Entity Model, giảm thiểu code lặp lại (boilerplate) khi gán từng thuộc tính thủ công."
      }
    ],
    codeSnippet: `// 1. Entity Model (Lưu trong Database - Chứa dữ liệu nhạy cảm)
public class User 
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string PasswordHash { get; set; } // ⚠️ Nhạy cảm!
}

// 2. DTO (Trả về cho Client - Đã che giấu dữ liệu nhạy cảm)
public class UserResponseDto 
{
    public int Id { get; set; }
    public string Username { get; set; }
    // Không có PasswordHash ở đây
}

// 3. Cấu hình AutoMapper
public class UserProfile : Profile 
{
    public UserProfile() 
    {
        // Tự động map các trường có cùng tên từ User sang UserResponseDto
        CreateMap<User, UserResponseDto>();
    }
}

// 4. Sử dụng trong Service
public async Task<UserResponseDto> GetUserAsync(int id) 
{
    var user = await _context.Users.FindAsync(id);
    
    // AutoMapper tự động chuyển đổi Entity -> DTO
    var userDto = _mapper.Map<UserResponseDto>(user);
    
    return userDto;
}`
  }
];
