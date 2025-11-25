output "instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.ekomart_server.id
}

output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = var.create_elastic_ip ? aws_eip.ekomart_eip[0].public_ip : aws_instance.ekomart_server.public_ip
}

output "instance_private_ip" {
  description = "Private IP address of the EC2 instance"
  value       = aws_instance.ekomart_server.private_ip
}

output "security_group_id" {
  description = "Security group ID"
  value       = aws_security_group.ekomart_sg.id
}

output "ssh_command" {
  description = "SSH command to connect to the instance"
  value       = "ssh -i ${var.key_name}.pem ubuntu@${var.create_elastic_ip ? aws_eip.ekomart_eip[0].public_ip : aws_instance.ekomart_server.public_ip}"
}

output "frontend_url" {
  description = "Frontend application URL"
  value       = "http://${var.create_elastic_ip ? aws_eip.ekomart_eip[0].public_ip : aws_instance.ekomart_server.public_ip}:31000"
}

output "backend_url" {
  description = "Backend API URL"
  value       = "http://${var.create_elastic_ip ? aws_eip.ekomart_eip[0].public_ip : aws_instance.ekomart_server.public_ip}:31100"
}

output "argocd_url" {
  description = "ArgoCD UI URL"
  value       = "http://${var.create_elastic_ip ? aws_eip.ekomart_eip[0].public_ip : aws_instance.ekomart_server.public_ip}:8080"
}

output "prometheus_url" {
  description = "Prometheus URL"
  value       = "http://${var.create_elastic_ip ? aws_eip.ekomart_eip[0].public_ip : aws_instance.ekomart_server.public_ip}:9090"
}

output "grafana_url" {
  description = "Grafana URL"
  value       = "http://${var.create_elastic_ip ? aws_eip.ekomart_eip[0].public_ip : aws_instance.ekomart_server.public_ip}:3000"
}

output "instance_details" {
  description = "Complete instance details"
  value = {
    instance_id   = aws_instance.ekomart_server.id
    instance_type = aws_instance.ekomart_server.instance_type
    ami_id        = aws_instance.ekomart_server.ami
    public_ip     = var.create_elastic_ip ? aws_eip.ekomart_eip[0].public_ip : aws_instance.ekomart_server.public_ip
    private_ip    = aws_instance.ekomart_server.private_ip
  }
}
