# app/models/user.rb
class User < ApplicationRecord
  has_secure_password

  # Şimdilik enum yok, sorun çıkarıyordu
  # enum :role, { admin: "admin", employee: "employee" }

  validates :email, presence: true, uniqueness: true
end
