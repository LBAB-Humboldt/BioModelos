class Publication < ActiveRecord::Base

	attr_accessor :terminos

	validates :user_id, :presence => true
	validates :cc_license, :presence => true
	validates :records_vis, :presence => true
	validates :sib_contact, :presence => true
	#validates :atlas_agreement, :presence => true
	validates :terminos, presence: true, acceptance: {message: "Debe aceptar los términos y condiciones."} 

	belongs_to :user

	mount_uploader :files, PublicationUploader
	validates :files, presence: {message: "Debe adjuntar un archivo válido para subir."}
	
end