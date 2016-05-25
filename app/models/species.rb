class Species < ActiveRecord::Base
	
	has_many :models
	has_and_belongs_to_many :groups
	has_many :species_groups
	has_and_belongs_to_many :categories
	acts_as_commentable

	def self.search(options)
		if options[:query] and options[:class_id]
      		where("sci_name like ? and class_id = ? and current = ?", "%#{options[:query]}%", "#{options[:class_id]}", "t").limit(10)
    	elsif options[:query]
      		where("sci_name like ? and current = ?", "%#{options[:query]}%", "t").limit(10)
    	end
	end

end
