class FixBugForeignKeysAndNullable < ActiveRecord::Migration[8.1]
  def change
    # Remove as foreign keys incorretas
    remove_foreign_key :bugs, :assignees if foreign_key_exists?(:bugs, :assignees)
    remove_foreign_key :bugs, :reporters if foreign_key_exists?(:bugs, :reporters)

    # Permite NULL nos campos (alinhado com optional: true do modelo)
    change_column_null :bugs, :assignee_id, true
    change_column_null :bugs, :reporter_id, true

    # Adiciona as foreign keys corretas para a tabela users
    add_foreign_key :bugs, :users, column: :assignee_id
    add_foreign_key :bugs, :users, column: :reporter_id
  end
end