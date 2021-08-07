
resource "doppler_secret" "database_url_prod" {
  project = "perfolio"
  config  = "prod"
  name    = "DATABASE_URL"
  value   = var.database_urls.prod
}
resource "doppler_secret" "database_url_staging" {
  project = "perfolio"
  config  = "staging"
  name    = "DATABASE_URL"
  value   = var.database_urls.staging
}
resource "doppler_secret" "database_url_dev" {
  project = "perfolio"
  config  = "dev"
  name    = "DATABASE_URL"
  value   = var.database_urls.dev
}
