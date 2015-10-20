class ContactMailer < ActionMailer::Base
  default from: "feedback@biomodelos.humboldt.org.co"

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.contact_mailer.contact_us.subject
  #
  def contact_us(message)
    @message = message
    @datetime = DateTime.now
    mail to: "biomodelos@humboldt.org.co",  subject: "Feedback desde BioModelos"
  end

  # Envío de notificaciones periodicas a usuarios.
  # Contiene información relacionada con grupos y personas a las que siguen los usuarios
  def send_mail_notifications(id, name, email, last_email_send, periodicity)
    @name = name
    @email = email
    following = UserRelationship.where(:follower_id => id)
    my_groups = GroupUser.where(:user_id => id, :group_user_state_id =>  1)
    user_list = '0'
    group_list = '0'

    following.each do |f|
      user_id = ','+f.user_id.to_s
      user_list += user_id
    end

    my_groups.each do |f|
      group_id = ','+f.group_id.to_s
      group_list += group_id
    end

    # ---------------------------------------------------------------
    last_email_send -= 300.day # Only for Quick Testing - Remove in production
    # ---------------------------------------------------------------

    @notifications = User.find_by_sql("
      SELECT * FROM (
        SELECT
          g.id,
          g.name,
          gu.user_id,
          u.name user_name,
          gu.updated_at,
          'new_user' type
        FROM groups g, group_users gu, users u
        WHERE g.id = gu.group_id AND u.id = gu.user_id AND gu.group_user_state_id = 1
        AND gu.group_id in (" + group_list + ") AND gu.updated_at > '" + l( last_email_send) + "'
        UNION
        SELECT
          g.id,
          g.name,
          sg.species_id,
          s.sci_name user_name,
          sg.updated_at,
          'new_specie' type
        FROM groups g, species_groups sg, species_group_states gus, species s
        WHERE g.id = sg.group_id AND s.id = sg.species_id AND sg.species_group_state_id = 1
        AND sg.group_id in (" + group_list + ") AND sg.updated_at > '" + l( last_email_send ) + "'
        UNION
        SELECT
          m.id,
          s.sci_name name,
          r.user_id,
          u.name user_name,
          r.updated_at,
          'review' type
        FROM reviews r, models m, species s, users u
        WHERE m.id = r.model_id and s.id=m.species_id AND u.id = r.user_id
        AND r.user_id in (" + user_list + ") AND r.updated_at > '" + l(last_email_send) + "'
      )ORDER BY updated_at DESC LIMIT 35
    ")
    @periodicity = periodicity

    case periodicity
      when 1
        subj="Notificacion Diaria de Actividad en Biomodelos"
      when 2
        subj="Notificacion Semanal de Actividad en Biomodelos"
      when 3
        subj="Notificacion Mensual de Actividad en Biomodelos"
    end
    #mail to: mail,  subject: subj

    if @notifications
      mail from: "noreply@biomodelos.humboldt.org.co", to: "miguelstratoss@gmail.com",  subject: subj # Comentar en Producci
      # mail from: "noreply@biomodelos.humboldt.org.co", to: email,  subject: subj # Descomentar en Producción
      user=User.find(id)
      user.last_email_send=Date.today
      user.save
    end
  end


  # Función para Envío de mensajes de Administrador de grupo a mimbros de grupo
  def bulk_email_group (message, subject, email, group_name, email_from)
    @message = message
    @group_name=group_name
    @email = email
    @subject = subject
    @datetime = DateTime.now
    @email_from = email_from
    #mail to: mail,  subject: subject    # Descomentar en producción
    mail to: email,  subject: subject  # Comentar en producción
  end

  # Función para el envío de Invitaciones a Amigos externos a Biomodelos
  def email_invitation (message, name, email, group_name, email_from, name_from)
    @message = message
    @group_name=group_name
    @email = email
    @name = name
    @datetime = DateTime.now
    @email_from = email_from
    @name_from = name_from
    subject = "Has Recibido una invitación desde Biomodelos"
    mail to: email,  subject: subject
  end
  
  def email_new_group(message)
    @message = message
    @datetime = DateTime.now
    mail from: "noreply@biomodelos.humboldt.org.co" , to: "dlopez@humboldt.org.co",  subject: "Sugerencia de Nuevo Grupo BioModelos"
  end

end
