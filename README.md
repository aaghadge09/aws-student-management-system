# Student Management System on AWS

A beginner-friendly Flask JSON API and Express web dashboard for the three deployment configurations in the assignment. This repository is a **project starter and deployment guide**. It does not claim any AWS deployment, screenshots, URL, or GitHub repository exists yet.

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

Follow one deployment at a time. Capture terminal output and AWS console evidence as you go. Never publish credentials or private keys. Restrict SSH to your IP and backend traffic to the frontend security group. AWS charges may apply; stop/delete resources after capture and verify billing.

## Submission checklist
1. Complete deployments and populate `screenshots/task1`, `task2`, and `task3` with real captures.
2. Update `deployment-links.txt` with the real repository and app URLs; ensure URLs point to the deployed app you tested.
3. Fill in `AWS_Deployment_Report.docx`, replacing every bracketed prompt and inserting genuine screenshots.
4. Check the final folder, then zip the entire `AWS_Aryan_Ghadge` folder as `AWS_Aryan_Ghadge.zip`.
5. Keep the ZIP as the one portal upload. A stopped EC2 public IP may no longer work; capture URL before stopping and use an Elastic IP only if you understand its possible cost.
