class GroupUsersController < ApplicationController
  # Crea o actualiza la relación entre un usuario y un grupo
  def create
    group_params=params[:group_user]
    group_user1 = GroupUser.find_by_group_id_and_user_id(group_params[:group_id], current_user.id)
    if group_user1
      group_user1.is_admin=false
      case group_user1.group_user_state_id
        when 1
          group_user1.group_user_state_id = 4
        when 2
          group_user1.group_user_state_id = 2
        when 3
          group_user1.group_user_state_id = 2
        when 4
          group_user1.group_user_state_id = 2
      end
      if group_user1.save
        @message = true
        redirect_to group_path(id:group_params[:group_id])
      else
        @message = false
      end
    else
      group_user = GroupUser.new
      group_user.group_id=group_params[:group_id]
      group_user.user_id=current_user.id
      group_user.group_user_state_id=2
      if group_user.save
        redirect_to group_path(id:group_params[:group_id])
      else
        @message = false
      end
    end
  end

  def update
  end

  # Establece el estado de la relaciòn entre un usuario y un grupo
  def set_state
    @return = false
    group_user = GroupUser.find(params[:id])
    group_user.group_user_state_id = params[:state]
    if group_user.save
      @return=true      
    end
    return @return
  end
end
