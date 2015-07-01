class GroupUser < ActiveRecord::Base
  belongs_to :user
  belongs_to :group
  belongs_to :group_user_state
end
