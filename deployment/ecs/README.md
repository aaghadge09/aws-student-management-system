# ECS Fargate with ECR and a VPC

The project includes an executable CloudFormation template at [`../cloudformation/ecs-stack.yaml`](../cloudformation/ecs-stack.yaml). It creates a Fargate cluster, one private Flask task and service, one private Express task and service, Cloud Map service discovery, CloudWatch logs, security groups, and an internet-facing Application Load Balancer. Backend ingress is restricted to the frontend task security group; frontend ingress is restricted to the ALB security group.

## Requirements and cost

Use the AWS Console CloudShell in the same account and region as your ECR images. The commands below assume `ap-southeast-2`, repository names `student-backend` and `student-frontend`, and the VPC template in `../cloudformation/network-stack.yaml`. Confirm your current budget first. A NAT gateway, ALB, Fargate tasks, public IPv4 addresses, logs, and ECR storage can all incur charges. The user's previously authorized cap for this assignment is INR 200; cost alerts are not hard spending limits. Keep the resources up only long enough to verify and capture evidence, then delete them.

## 1. Build and push images

The Dockerfiles are in `backend/` and `frontend/`. From the project root, build and push with Docker and AWS CLI. Create ECR repositories first if they do not already exist.

```bash
aws ecr create-repository --repository-name student-backend --region ap-southeast-2 2>/dev/null || true
aws ecr create-repository --repository-name student-frontend --region ap-southeast-2 2>/dev/null || true
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=ap-southeast-2
aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"
docker build -t student-backend ./backend
docker build -t student-frontend ./frontend
docker tag student-backend:latest "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/student-backend:latest"
docker tag student-frontend:latest "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/student-frontend:latest"
docker push "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/student-backend:latest"
docker push "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/student-frontend:latest"
```

After pushing, record the actual image digests from ECR and capture the repository pages. Do not copy credentials or login tokens into the report.

## 2. Create the network

Upload `deployment/cloudformation/network-stack.yaml` to CloudShell, then run:

```bash
aws cloudformation deploy --template-file network-stack.yaml --stack-name student-assignment-network --region ap-southeast-2
aws cloudformation describe-stacks --stack-name student-assignment-network --region ap-southeast-2 --query 'Stacks[0].Outputs' --output table
```

Record the actual VPC, public subnet, and private subnet outputs. The network stack includes one NAT gateway for private subnet egress. This is billable while it exists.

## 3. Deploy the services

Use the account ID and subnet IDs shown by AWS, not example values. The network and application stacks are separate so they can be removed in a controlled order.

```bash
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
VPC_ID=$(aws cloudformation describe-stacks --stack-name student-assignment-network --region ap-southeast-2 --query "Stacks[0].Outputs[?OutputKey=='VpcId'].OutputValue | [0]" --output text)
PUBLIC_A=$(aws cloudformation describe-stacks --stack-name student-assignment-network --region ap-southeast-2 --query "Stacks[0].Outputs[?OutputKey=='PublicSubnetA'].OutputValue | [0]" --output text)
PUBLIC_B=$(aws cloudformation describe-stacks --stack-name student-assignment-network --region ap-southeast-2 --query "Stacks[0].Outputs[?OutputKey=='PublicSubnetB'].OutputValue | [0]" --output text)
PRIVATE_A=$(aws cloudformation describe-stacks --stack-name student-assignment-network --region ap-southeast-2 --query "Stacks[0].Outputs[?OutputKey=='PrivateSubnetA'].OutputValue | [0]" --output text)
PRIVATE_B=$(aws cloudformation describe-stacks --stack-name student-assignment-network --region ap-southeast-2 --query "Stacks[0].Outputs[?OutputKey=='PrivateSubnetB'].OutputValue | [0]" --output text)
aws cloudformation deploy --template-file ecs-stack.yaml --stack-name student-management-ecs --region ap-southeast-2 --capabilities CAPABILITY_IAM --parameter-overrides VpcId="$VPC_ID" PublicSubnetIds="$PUBLIC_A,$PUBLIC_B" PrivateSubnetIds="$PRIVATE_A,$PRIVATE_B" BackendImage="$ACCOUNT_ID.dkr.ecr.ap-southeast-2.amazonaws.com/student-backend:latest" FrontendImage="$ACCOUNT_ID.dkr.ecr.ap-southeast-2.amazonaws.com/student-frontend:latest"
aws cloudformation describe-stacks --stack-name student-management-ecs --region ap-southeast-2 --query 'Stacks[0].Outputs' --output table
```

Wait for both ECS services to show one running task and for the ALB target to report healthy. Test the `AppUrl` output in a browser. Verify `/health`, list students, add one, delete it, and confirm the list again. Capture real terminal output, ECR pages, VPC/security group configuration, ECS service health, target health, and the tested app URL. Put your actual screenshots in `screenshots/task3/` and fill the corresponding section in the Word report.

The supplied task-definition JSON files remain useful as standalone examples; the CloudFormation stack creates its own equivalent task definitions for a fully wired deployment.

## Cleanup

Capture evidence before cleanup. Delete the ECS application stack first, then the network stack:

```bash
aws cloudformation delete-stack --stack-name student-management-ecs --region ap-southeast-2
aws cloudformation wait stack-delete-complete --stack-name student-management-ecs --region ap-southeast-2
aws cloudformation delete-stack --stack-name student-assignment-network --region ap-southeast-2
aws cloudformation wait stack-delete-complete --stack-name student-assignment-network --region ap-southeast-2
```

If ECR storage is no longer needed, remove the image repositories from the ECR console or run `aws ecr delete-repository --repository-name student-backend --force --region ap-southeast-2` and repeat for `student-frontend`. Confirm there are no remaining load balancers, NAT gateways, Elastic IPs, ECS tasks, log groups, or volumes and review Cost Explorer. Stopping EC2 alone does not clean up these resources.
