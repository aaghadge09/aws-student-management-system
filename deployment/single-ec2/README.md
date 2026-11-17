# One EC2 instance

Use an Ubuntu LTS EC2 instance for a student demo. Create a security group with SSH (22) restricted to **your current IP**, and HTTP app port 3000 only as needed. Avoid opening Flask port 5000 publicly; the Express proxy talks to localhost. Launch and connect, then run the commands below from the project root after uploading/cloning it.

```bash
sudo apt update && sudo apt install -y python3-venv python3-pip nodejs npm
cd AWS_Aryan_Ghadge
python3 -m venv .venv
. .venv/bin/activate
pip install -r backend/requirements.txt
( cd backend && gunicorn --bind 127.0.0.1:5000 app:app ) > /tmp/student-api.log 2>&1 &
cd frontend && npm install
API_URL=http://127.0.0.1:5000 PORT=3000 npm start
```

Open `http://EC2-PUBLIC-IP:3000`. For a durable setup use systemd and a reverse proxy/TLS; these foreground commands are for learning. Stop or terminate the instance after recording evidence. Replace the public IP after stop/start if it is not static.
