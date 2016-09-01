class ChangePointCommentColumnNames < ActiveRecord::Migration
  def change
  	rename_column :point_comments, :wrong_id, :idIssue
  	rename_column :point_comments, :geo_problem, :geoIssue

  	add_column :point_comments, :isOutlier, :boolean, default: 'f'
  	add_column :point_comments, :oldTaxonomy, :boolean, default: 'f'
  	add_column :point_comments, :inCaptivity, :boolean, default: 'f'
  	add_column :point_comments, :otherIssues, :boolean, default: 'f'

  end
end
