CarrierWave.configure do |config|
  config.root = Rails.root
  config.cache_dir = Rails.root.join("tmp","uploads")
end