class HomeController < ApplicationController
  def show
    if user_signed_in?
      user=User.find_by_id(current_user.id)
      if user.group_id != 0 && user.group_id != nil
        group_user = GroupUser.new
        group_user.group_id = user.group_id
        group_user.group_user_state_id=2
        group_user.user_id=user.id
        group_user.is_admin=1
        if group_user.save
          user.group_id=nil
          user.save
        end
      end
      if user.requested_group_name != '' && user.requested_group_name != nil
        group = Group.new
        group.name = user.requested_group_name
        group.description = user.requested_group_name
        group.email = user.email
        group.link = ''
        group.group_state_id=2
        if group.save
          group_user2 = GroupUser.new
          group_user2.user_id = user.id
          group_user2.group_id=group.id
          group_user2.group_user_state_id=1
          group_user2.is_admin=1
          group_user2.save
          user.requested_group_name=''
          user.save
        end
      end
    end
  end

  def send_message
  	@message = Message.new(message_params)
  	ContactMailer.contact_us(@message).deliver

  	respond_to do |format|
  		format.js
  	end
  end

  def groups

    avesexp_ids = [87,78,73,86,74,77,79,80,85,82,68,84,23,89,88,81,83,21,28,22,26,25,32,19,24]
    herpexp_ids = [179,173,169,168,170,178,176,174,175,172,177,171,154,181]
    mamexp_ids = [142,137,152,143,139,138,145,127,141,144,147,146,140,149,148]
    pecesexp_ids = [183, 185, 184, 186, 164, 187, 188]

    @aves_experts = User.find(avesexp_ids)
    @aves_experts.sort! { |a,b| a.name.downcase <=> b.name.downcase }
    

    @herpetos_experts = User.find(herpexp_ids)
    @herpetos_experts.sort! { |a,b| a.name.downcase <=> b.name.downcase }

    @mamiferos_experts = User.find(mamexp_ids)
    @mamiferos_experts.sort! { |a,b| a.name.downcase <=> b.name.downcase }

    @peces_experts = User.find(pecesexp_ids)
    @peces_experts.sort! { |a,b| a.name.downcase <=> b.name.downcase }


  end

  private

    def message_params
      params.require(:message).permit(:name, :email, :subject, :content)
    end

end
