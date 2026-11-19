# Student Management System on AWS

A beginner-friendly Flask JSON API and Express web dashboard for the three deployment configurations in the assignment. The backend and frontend Dockerfiles are included. Local container behavior and ECR image publishing have been verified; the EC2 and ECS services have not yet been deployed.

## Run locally
Requirements: Python 3.10+ and Node.js 18+ (Docker Compose is an alternative).

Terminal 1:
```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate  | macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python app.py
```
Terminal 2:
```bash
cd frontend
npm install
npm start
```
Open http://localhost:3000. API health check: http://localhost:5000/health. Or from project root run `docker compose up --build`, then open http://localhost:3000.

## Local container verification

On 2026-11-17, both images built with `docker compose build` and both services started with `docker compose up -d`. The web health endpoint returned `ok`; the API returned two sample students; a POST added a temporary student; DELETE removed it; and a final GET returned the original two records. This verifies the containers and Express proxy locally. It is not evidence of an AWS deployment.

## Features and limits
List/add/delete students; Flask JSON endpoints; Express serves the UI and proxies `/api` requests. Data is stored in memory and resets on backend restart. This is a classroom demo, not a production system.

## AWS deployment
- [Single EC2](deployment/single-ec2/README.md)
- [Separate EC2](deployment/separate-ec2/README.md)
- [ECR, ECS Fargate, VPC](deployment/ecs/README.md)
- [ECS Fargate task definition files](deployment/ecs/task-definitions/README.md)
- [CloudFormation deployment templates](deployment/cloudformation/)

## Verified AWS status

On 2026-11-17, images tagged `latest` were built and pushed to the `student-backend` and `student-frontend` ECR repositories in `ap-southeast-2`. No EC2 instances, ECS services, application load balancer, or assignment VPC have been provisioned. There are no live application URLs or AWS deployment screenshots in this package. ECR image upload alone does not complete the assignment.

The local container verification on 2026-11-17 confirmed the frontend health endpoint, student list, POST, DELETE, and final list through the Express proxy. It is local evidence only. See `AWS_Deployment_Report.docx` for the current truthful status and the remaining hands-on requirements.

Follow one deployment at a time. Capture terminal output and AWS console evidence as you go. Never publish credentials or private keys. Restrict SSH to your IP and backend traffic to the frontend security group. AWS charges may apply; delete resources after capture and verify billing.

## Submission checklist
1. Deploy all three configurations and populate `screenshots/task1`, `task2`, and `task3` with genuine captures.
2. Update `deployment-links.txt` with the tested app URLs.
3. Update the report with actual deployment results and insert genuine screenshots.
4. Verify cleanup and cost status, then zip the entire `AWS_Aryan_Ghadge` folder as `AWS_Aryan_Ghadge.zip`.
5. Submit the ZIP only after those items are complete. The package currently documents code and verified image publishing, but is not a complete assignment submission.
