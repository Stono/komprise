variable "gcp_project_name" {
  description = "The project name on GCP"
}

variable "target_region" {
  description = "The project and compute target region"
}

variable "env" {
  description = "The environment name"
}

variable "subnet_ip_range" {
  description = "The ip range for the cluster subnet"
}

variable "network_name" {
  description = "The name for the network"
}

variable "stack_name" {
  description = "The name of the stack"
}

variable "gke_ip_range" {
  description = "The ip range for the GKE virtual machines"
}

variable "container_cidr_range" {
  description = "The ip range for the GKE containers"
}

variable "cluster_password" {
  description = "The password for logging into kubernetes ui"
}

variable "target_zone_a" {
  description = "HA Zone 1"
}

variable "target_zone_b" {
  description = "HA Zone 1"
}
