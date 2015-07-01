class SpeciesGroupsController < ApplicationController
  def index
  end

  def update
  end

  # Crea la relación entre una especie y un grupo
  def create
    @species_group = SpeciesGroup.new
    species_params=params[:species_group]
    @species_group.group_id=species_params[:group_id]
    @species_group.species_id=species_params[:species_id]
    @species_group.species_group_state_id=species_params[:species_group_state_id]
    if @species_group.save
      redirect_to group_path(id:species_params[:group_id])
    end
  end

  # Establece el estado de la relación entre una especie y un grupo
  def set_state
    @return=false
    species_group = SpeciesGroup.find(params[:id])
    species_group.species_group_state_id = params[:state]
    if species_group.save
      @return=true
      return true
    end
  end

end
