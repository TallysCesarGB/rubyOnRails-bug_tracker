# app/models/bug.rb
class Bug < ApplicationRecord
  belongs_to :project
  belongs_to :reporter, class_name: "User"
  belongs_to :assignee, class_name: "User", optional: true
  has_many   :comments, dependent: :destroy

  SEVERITIES = %w[low medium high critical].freeze
  STATUSES   = %w[open in_progress resolved closed].freeze

  validates :title,    presence: true
  validates :severity, inclusion: { in: SEVERITIES }
  validates :status,   inclusion: { in: STATUSES }
end