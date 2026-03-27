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

ActiveRecord::Schema[8.1].define(version: 2026_03_27_181618) do
  create_table "bugs", force: :cascade do |t|
    t.integer "assignee_id", null: false
    t.datetime "created_at", null: false
    t.text "description"
    t.integer "project_id", null: false
    t.integer "reporter_id", null: false
    t.string "severity"
    t.string "status"
    t.string "title"
    t.datetime "updated_at", null: false
    t.index ["assignee_id"], name: "index_bugs_on_assignee_id"
    t.index ["project_id"], name: "index_bugs_on_project_id"
    t.index ["reporter_id"], name: "index_bugs_on_reporter_id"
  end

  create_table "comments", force: :cascade do |t|
    t.text "body"
    t.integer "bug_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["bug_id"], name: "index_comments_on_bug_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "projects", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "description"
    t.string "name"
    t.string "status"
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email"
    t.string "name"
    t.string "role"
    t.datetime "updated_at", null: false
  end

  add_foreign_key "bugs", "assignees"
  add_foreign_key "bugs", "projects"
  add_foreign_key "bugs", "reporters"
  add_foreign_key "comments", "bugs"
  add_foreign_key "comments", "users"
end
