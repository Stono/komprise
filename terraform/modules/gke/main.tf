resource "google_container_cluster" "cluster" {
  depends_on = ["module.subnet"]
  name = "${var.stack_name}-${var.env}"
  zone = "${var.target_zone_a}"
  additional_zones = ["${var.target_zone_b}"]
  network = "${var.network_name}"
  subnetwork = "${var.subnet_name}"
  cluster_ipv4_cidr = "${var.container_cidr_range}"
  monitoring_service = "monitoring.googleapis.com"

  master_auth {
    username = "${var.cluster_username}"
    password = "${var.cluster_password}"
  }

  initial_node_count = 1
  node_version = "1.5.4"
  node_config {
	  machine_type = "n1-standard-2"
	  disk_size_gb = "100"

    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform",
  	  "https://www.googleapis.com/auth/compute",
  	  "https://www.googleapis.com/auth/devstorage.read_write",
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/servicecontrol",
      "https://www.googleapis.com/auth/service.management",
      "https://www.googleapis.com/auth/datastore",
      "https://www.googleapis.com/auth/pubsub",
      "https://www.googleapis.com/auth/monitoring"
    ]
  }
}
