class CreateShiftTemplates < ActiveRecord::Migration[8.0]
  def change
    create_table :shift_templates do |t|
      t.string :name
      t.string :start_time
      t.string :end_time

      t.timestamps
    end
  end
end
