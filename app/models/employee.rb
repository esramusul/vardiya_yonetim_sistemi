class Employee < ApplicationRecord
  belongs_to :department
  belongs_to :user, optional: true
  has_many :shift_assignments, dependent: :destroy
  has_many :shifts, through: :shift_assignments

  validates :full_name, presence: true
end
