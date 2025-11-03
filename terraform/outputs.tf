output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.testinstance.id
}

output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.testinstance.public_ip
}

output "instance_public_dns" {
  description = "Public DNS name of the EC2 instance"
  value       = aws_instance.testinstance.public_dns
}

output "ssh_connection_command" {
  description = "SSH command to connect to the instance"
  value       = "ssh -i \"terra-automate-key\" ec2-user@${aws_instance.testinstance.public_dns}"
}

output "key_name" {
  description = "Name of the SSH key pair"
  value       = aws_key_pair.deployer.key_name
}
