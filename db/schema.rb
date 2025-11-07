# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_11_07_151502) do
  create_table "departments", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "employees", force: :cascade do |t|
    t.string "full_name"
    t.integer "department_id", null: false
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["department_id"], name: "index_employees_on_department_id"
    t.index ["user_id"], name: "index_employees_on_user_id"
  end

  create_table "shift_assignments", force: :cascade do |t|
    t.integer "shift_id", null: false
    t.integer "employee_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["employee_id"], name: "index_shift_assignments_on_employee_id"
    t.index ["shift_id"], name: "index_shift_assignments_on_shift_id"
  end

  create_table "shift_templates", force: :cascade do |t|
    t.string "name"
    t.string "start_time"
    t.string "end_time"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "shifts", force: :cascade do |t|
    t.date "work_date"
    t.integer "department_id", null: false
    t.integer "shift_template_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["department_id"], name: "index_shifts_on_department_id"
    t.index ["shift_template_id"], name: "index_shifts_on_shift_template_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "password_digest"
    t.string "role"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "employees", "departments"
  add_foreign_key "employees", "users"
  add_foreign_key "shift_assignments", "employees"
  add_foreign_key "shift_assignments", "shifts"
  add_foreign_key "shifts", "departments"
  add_foreign_key "shifts", "shift_templates"
end
