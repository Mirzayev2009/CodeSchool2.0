# React.js Deployment on Ubuntu Server with Cloudflare Tunnel

## Overview
This guide explains how to deploy your CodeSchool React.js application on Ubuntu server using Cloudflare Tunnel without DNS configuration.

## Prerequisites
✅ Node.js 18.20.8 installed
✅ npm 10.8.2 installed  
✅ React application built successfully
✅ cloudflared installed and running

## Quick Start

### 1. Start Your React Application
```bash
cd /home/sanjar/projects/CodeSchool2.0
npm start
```

Your app will be running on `http://0.0.0.0:3000`

### 2. Set Up Cloudflare Tunnel

#### Option A: Use the Setup Script
```bash
./setup-tunnel.sh
```

#### Option B: Manual Setup

1. **Create a new tunnel:**
```bash
cloudflared tunnel create codeschool-app
```

2. **List your tunnels to get the tunnel ID:**
```bash
cloudflared tunnel list
```

3. **Create configuration file:**
```yaml
# cloudflared-config.yml
tunnel: YOUR_TUNNEL_ID
credentials-file: /home/sanjar/.cloudflared/YOUR_TUNNEL_ID.json

ingress:
  - hostname: codeschool-app.trycloudflare.com
    service: http://localhost:3000
  - service: http_status:404
```

4. **Run the tunnel:**
```bash
cloudflared tunnel --config cloudflared-config.yml run
```

### 3. Access Your Application
Your React app will be accessible at: `https://codeschool-app.trycloudflare.com`

## Production Deployment

### Using PM2 for Process Management
1. **Install PM2:**
```bash
npm install -g pm2
```

2. **Create PM2 ecosystem file:**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'codeschool-frontend',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

3. **Start with PM2:**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Systemd Service for Cloudflare Tunnel
1. **Create service file:**
```bash
sudo nano /etc/systemd/system/cloudflared.service
```

2. **Add service configuration:**
```ini
[Unit]
Description=Cloudflare Tunnel
After=network.target

[Service]
Type=simple
User=sanjar
WorkingDirectory=/home/sanjar/projects/CodeSchool2.0
ExecStart=/usr/local/bin/cloudflared tunnel --config /home/sanjar/projects/CodeSchool2.0/cloudflared-config.yml run
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

3. **Enable and start service:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
```

## Useful Commands

### Application Management
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check server status
ps aux | grep node
```

### Tunnel Management
```bash
# List all tunnels
cloudflared tunnel list

# Run tunnel with config
cloudflared tunnel --config cloudflared-config.yml run

# Run tunnel in background
nohup cloudflared tunnel --config cloudflared-config.yml run &

# Check tunnel status
cloudflared tunnel info TUNNEL_NAME

# Delete tunnel
cloudflared tunnel delete TUNNEL_NAME
```

### Process Management with PM2
```bash
# View running processes
pm2 list

# View logs
pm2 logs codeschool-frontend

# Restart application
pm2 restart codeschool-frontend

# Stop application
pm2 stop codeschool-frontend

# Delete from PM2
pm2 delete codeschool-frontend
```

## Troubleshooting

### Common Issues

1. **Port already in use:**
```bash
# Find process using port 3000
sudo lsof -i :3000
# Kill the process
sudo kill -9 PID
```

2. **Permission denied:**
```bash
# Fix permissions
sudo chown -R $USER:$USER /home/sanjar/projects/CodeSchool2.0
```

3. **Tunnel connection issues:**
```bash
# Check cloudflared status
systemctl status cloudflared
# View logs
journalctl -u cloudflared -f
```

### Performance Optimization

1. **Enable gzip compression:**
Add to your server.js:
```javascript
import compression from 'compression';
app.use(compression());
```

2. **Set proper cache headers:**
```javascript
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1y',
  etag: false
}));
```

## Security Considerations

1. **Firewall configuration:**
```bash
# Only allow SSH and necessary ports
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 3000/tcp  # Only if needed for local access
```

2. **Keep dependencies updated:**
```bash
npm audit
npm audit fix
```

3. **Environment variables:**
Create `.env` file for sensitive configuration:
```bash
NODE_ENV=production
PORT=3000
```

## Monitoring

### Check application health:
```bash
curl http://localhost:3000
```

### Monitor logs:
```bash
# PM2 logs
pm2 logs --lines 50

# Cloudflared logs
journalctl -u cloudflared --lines 50
```

Your React.js application is now successfully deployed and accessible via Cloudflare Tunnel!