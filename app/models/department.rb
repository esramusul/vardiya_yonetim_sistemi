class Department < ApplicationRecord
  has_many :employees, dependent: :destroy
  has_many :shifts, dependent: :destroy

  validates :name, presence: true
end
