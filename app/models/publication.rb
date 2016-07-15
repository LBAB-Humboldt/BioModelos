class Publication < ActiveRecord::Base
	include CarrierWave::Validations::ActiveModel

	attr_accessor :terminos

	validates :user_id, :presence => true
	validates :cc_license, :presence => true
	validates :records_vis, :presence => true
	validates :sib_contact, :presence => true
	validates :files, :presence => true
	#validates :atlas_agreement, :presence => true
	validates :terminos, :presence => true

	belongs_to :user

	mount_uploader :files, PublicationUploader
	
end