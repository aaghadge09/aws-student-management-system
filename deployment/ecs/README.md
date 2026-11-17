# ECS Fargate with ECR and a VPC (console walkthrough)

This guide describes the AWS Console steps; no AWS resources are created by this package. Region, account, pricing, quotas, and console screens change, so confirm each choice in your own account. ECS/Fargate, ECR image storage/transfers, public IPv4 addresses, NAT gateways, load balancers, and logs can incur charges. A free-tier label does not guarantee zero cost.

## Build and push images
1. Install Docker and AWS CLI locally, configure credentials with an IAM identity limited to the assignment resources, and select one AWS region. Never put access keys in source code.
2. Create ECR repositories named `student-backend` and `student-frontend`.
3. From project root, build: `docker build -t student-backend ./backend` and `docker build -t student-frontend ./frontend`.
4. In ECR, open each repository and use **View push commands** for the exact account, region, login, tag, and push commands. Push each image.

## Network and service setup
1. In VPC, use a dedicated VPC with public subnets for an internet-facing Application Load Balancer and private subnets for tasks, across at least two Availability Zones where available. Use an Internet Gateway for public subnets. Private task image pulls/log shipping need outbound access: choose a NAT gateway (costly) or suitable VPC endpoints for ECR API, ECR Docker registry, and CloudWatch Logs. Confirm current endpoint requirements.
2. Create ECS cluster using AWS Fargate. Create task definition `student-backend`: Linux/x86_64 (match image build platform), 0.25 vCPU/0.5 GiB or larger if needed, ECR backend image, container port 5000, essential container. Create `student-frontend` task definition with port 3000 and environment variable `API_URL` pointing to the backend service's private DNS/service-discovery name and port.
3. Create backend service in private subnets with no public IP. Security group allows inbound TCP 5000 only from frontend task security group. Enable service discovery (Cloud Map) or use a private load balancer so the frontend has a stable backend name.
4. Create frontend service and an Application Load Balancer in public subnets; listener HTTP 80 forwards to frontend target group port 3000. Frontend task security group allows 3000 only from the ALB security group. ALB security group allows inbound 80 from your IP (or broadly only if you intentionally need public access); use HTTPS/ACM for real use. Assign frontend task security group to the frontend service.
5. Review the monthly estimate before creating. Wait for tasks/targets to become healthy, then record the ALB DNS name and test the UI.

The example app uses an in-memory list, so records reset when the task restarts and separate task replicas do not share data. For persistent production data add a database and authentication.

## Cleanup immediately after evidence capture
Delete ECS services first, then task definitions (deregister revisions), cluster, load balancer and target groups, Cloud Map namespace/service, NAT gateway, unused VPC endpoints, Elastic IPs, and any dedicated VPC resources. Delete ECR images/repositories and CloudWatch log groups if no longer required. Verify the Billing console/Cost Explorer after cleanup. Stopping EC2 does not remove EBS volumes, snapshots, Elastic IP charges, or ECS/networking resources.
