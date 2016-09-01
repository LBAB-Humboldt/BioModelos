class AddDataBaseIdColumn < ActiveRecord::Migration
  def change
  	add_column :point_comments, :dataBaseId, :string, limit: 255
  	rename_column :point_comments, :register_id, :recordId
  end
end
