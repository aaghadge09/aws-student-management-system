# Separate frontend and backend EC2 instances

Launch two instances in the same VPC. Give each an appropriate security group. Backend SG: inbound TCP 5000 **only from the frontend SG**; SSH only from your IP. Frontend SG: inbound TCP 3000 from your IP for a temporary demo; SSH only from your IP. Do not allow `0.0.0.0/0` to backend port 5000. For safer production access use a load balancer and TLS.

On backend instance, upload/clone project and run:

```bash
sudo apt update && sudo apt install -y python3-venv python3-pip
cd AWS_Aryan_Ghadge/backend
python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
gunicorn --bind 0.0.0.0:5000 app:app
```

On frontend instance, install Node.js/npm, then:

```bash
cd AWS_Aryan_Ghadge/frontend
npm install
API_URL=http://BACKEND_PRIVATE_IP:5000 PORT=3000 npm start
```

Use the backend **private IPv4 address** and verify both instances can reach each other. In production, make the API a private ECS service or use service discovery; this demo has no database/authentication.
