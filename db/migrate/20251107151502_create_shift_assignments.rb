class CreateShiftAssignments < ActiveRecord::Migration[8.0]
  def change
    create_table :shift_assignments do |t|
      t.references :shift, null: false, foreign_key: true
      t.references :employee, null: false, foreign_key: true

      t.timestamps
    end
  end
end
