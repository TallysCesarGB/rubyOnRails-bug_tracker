class User < ApplicationRecord
  has_many :reported_bugs, class_name: "Bug", foreign_key: "reporter_id"
  has_many :assigned_bugs,  class_name: "Bug", foreign_key: "assignee_id"
  has_many :comments
  validates :email, presence: true, uniqueness: true
end