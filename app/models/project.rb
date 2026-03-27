class Project < ApplicationRecord
  has_many :bugs, dependent: :destroy
  validates :name, presence: true
end