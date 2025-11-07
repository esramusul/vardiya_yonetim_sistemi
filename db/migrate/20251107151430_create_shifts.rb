class CreateShifts < ActiveRecord::Migration[8.0]
  def change
    create_table :shifts do |t|
      t.date :work_date
      t.references :department, null: false, foreign_key: true
      t.references :shift_template, null: false, foreign_key: true

      t.timestamps
    end
  end
end
