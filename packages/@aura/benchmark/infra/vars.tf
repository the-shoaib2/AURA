variable "location" {
  description = "Region to deploy resources"
  default     = "East US"
}

variable "resource_group_name" {
  description = "Name of the resource group"
  default     = "aura-benchmarking"
}

variable "host_size_family" {
  description = "Size Family for the Host Group"
  default     = "DCSv2-Type1"
}

variable "vm_size" {
  description = "VM Size"
  # 8 vCPUs, 32 GiB memory
  default = "Standard_DC8_v2"
}

variable "number_of_vms" {
  description = "Number of VMs to create"
  default     = 1
}

locals {
  common_tags = {
    Id        = "auraBenchmark"
    Terraform = "true"
    Owner     = "Catalysts"
    CreatedAt = timestamp()
  }
}
