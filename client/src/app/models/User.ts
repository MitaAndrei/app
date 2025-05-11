export interface User{
  username: string,
  passwordHash: string,
  passwordSalt: string,
  id: string,
  email: string,
  createdAt: Date,
}

//     public Guid Id { get; set; }
//     public string Username { get; set; }
//     public string Email { get; set; }
//     public string PasswordHash { get; set; }
//     public string PasswordSalt { get; set; }
//     public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
