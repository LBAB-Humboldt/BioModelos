class RatingsController < ApplicationController

	def create
		@rating = Rating.new(rating_params)
		if @rating.save
			respond_to do |format|
				format.js
			end
		end
	end

	def update
		@rating = Rating.find(params[:id])
		@model = @rating.model

		if @rating.update_attributes(score: params[:score])
			respond_to do |format|
				format.js
			end
		end
	end

	def destroy
		@rating = Rating.where(:model_id => params[:mid], :user_id => current_user.id).first
		if !@rating.blank?
			@rating.destroy
		end

		respond_to do |format|
			format.js
		end 
	end

	def rate_model
		
		@rating = Rating.where(:model_id => params[:mid], :user_id => current_user.id).first
		if @rating.blank?
			Rating.create({:model_id => params[:mid], :user_id => current_user.id, :score => params[:score]})
		else
			Rating.update(@rating.id, :score => params[:score])
		end

		respond_to do |format|
			format.js
		end
	end


	def exists_rating
		@models = Model.where(:species_id => Model.find(params[:mid]).species_id, :level => params[:lvl])

		alreadyRated = false
		@models.each do |m|
			if Rating.rating_exists(:model_id => m.id, :user_id => current_user.id) && m.id != params[:mid].to_i
				alreadyRated = true
				break
			end
		end

		render json: alreadyRated.to_json

	end

	private

    	def rating_params
      		params.require(:rating).permit(:model_id, :user_id, :score)
    	end

end