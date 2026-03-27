class CreateBugs < ActiveRecord::Migration[7.0]
  def change
    create_table :bugs do |t|
      t.string     :title,       null: false
      t.text       :description
      t.string     :severity,    default: "low"
      t.string     :status,      default: "open"
      t.references :project,     null: false, foreign_key: true
      t.references :reporter,    null: false, foreign_key: true
      t.references :assignee,                foreign_key: true 
      t.timestamps
    end
  end
end