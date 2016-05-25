class CreateCategories < ActiveRecord::Migration
  def change
    create_table :categories do |t|
    	t.string :name, null: false
    	t.timestamps
    end

    create_table :species_categories do |t|
    	t.references :species, null: false
    	t.references :categories, null: false
    	t.timestamps
    end
    add_index :species_categories, [:species_id, :categories_id]

  end
end
