class SpeciesGroup < ActiveRecord::Base
  belongs_to :species
  belongs_to :species_group_state
  belongs_to :group
end
