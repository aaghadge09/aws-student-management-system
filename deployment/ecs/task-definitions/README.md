# ECS Fargate task definition files

These task definitions are manifests, not deployment evidence. Replace the placeholder execution role, ECR image URI, and region values before registering them. Create the CloudWatch log group `/ecs/student-management` first, or configure `awslogs-create-group` and grant the task execution role permission to create log groups. The role must include the standard ECS task execution permissions for ECR image pulls and CloudWatch Logs.

The frontend expects the backend service to be registered in AWS Cloud Map as `student-api` in a private DNS namespace named `student.local`. If you choose another namespace or service name, update `API_URL` to match. ECS task definitions use Fargate's `awsvpc` network mode and a valid 0.25 vCPU/0.5 GiB Linux combination. Attach security groups so only frontend tasks can reach backend TCP 5000. Put task-definition registration and service networking details in the report only after observing them in AWS.

Register after images exist in ECR, for example:

```bash
aws ecs register-task-definition --cli-input-json file://deployment/ecs/task-definitions/backend-task-definition.json
aws ecs register-task-definition --cli-input-json file://deployment/ecs/task-definitions/frontend-task-definition.json
```

Official AWS references: [Fargate task definition requirements](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-tasks-services.html) and [ECS service discovery](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-discovery.html).
