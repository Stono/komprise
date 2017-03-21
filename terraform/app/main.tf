provider "google" {
  credentials = ""
  project      = "${var.gcp_project_name}"
  region       = "${var.target_region}"
}

module "subnet" {
  source = "../modules/cluster-subnet"
  env = "${var.env}"
  ip_range = "${var.subnet_ip_range}"
  network_name = "${var.network_name}"
  stack_name = "${var.stack_name}"
  target_region = "${var.target_region}"
}

module "gke" {
  source = "../modules/gke"
  env = "${var.env}"
  ip_range = "${var.gke_ip_range}"
  container_cidr_range = "${var.container_cidr_range}"
  cluster_password = "${var.cluster_password}"
  network_name = "${var.network_name}"
  stack_name = "${var.stack_name}"
  target_region = "${var.target_region}"
  target_zone_a = "${var.target_zone_a}"
  target_zone_b = "${var.target_zone_b}"
}
