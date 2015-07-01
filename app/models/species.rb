class Species < ActiveRecord::Base
	
	has_many :models
	has_and_belongs_to_many :groups
	has_many :species_groups
	acts_as_commentable

	def self.search(query, classId)
		where("sci_name like ? and class_id = ? and current = ?", "%#{query}%", "#{classId}", "t").limit(10)
	end

end
