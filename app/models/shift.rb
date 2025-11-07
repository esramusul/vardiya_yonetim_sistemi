class Shift < ApplicationRecord
  belongs_to :department
  belongs_to :shift_template
  has_many :shift_assignments, dependent: :destroy
  has_many :employees, through: :shift_assignments

  validates :work_date, presence: true

  scope :on_date, ->(date) { where(work_date: date) }
end
