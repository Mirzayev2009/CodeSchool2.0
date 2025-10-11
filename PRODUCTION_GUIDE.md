# CodeSchool Production Deployment Guide

## 🚀 Production Setup

This application is now configured for production deployment with automatic restart capabilities.

### Features Implemented

- ✅ **Security**: Helmet.js for security headers
- ✅ **Compression**: Gzip compression for faster loading
- ✅ **Caching**: Static file caching with proper headers
- ✅ **Error Handling**: Graceful error handling and logging
- ✅ **Health Check**: `/health` endpoint for monitoring
- ✅ **Auto-restart**: PM2 process management
- ✅ **System Startup**: Automatic startup on system boot

## 📋 Quick Start

### 1. Development Mode
```bash
npm run dev          # Start Vite dev server
```

### 2. Production Mode (Direct)
```bash
npm run build        # Build for production
npm run start:prod   # Start production server
```

### 3. Production Mode (PM2 - Recommended)
```bash
npm run build        # Build for production
npm run pm2:start:prod  # Start with PM2
```

## 🔧 PM2 Commands

| Command | Description |
|---------|-------------|
| `npm run pm2:start` | Start app with PM2 (development) |
| `npm run pm2:start:prod` | Start app with PM2 (production) |
| `npm run pm2:stop` | Stop the application |
| `npm run pm2:restart` | Restart the application |
| `npm run pm2:delete` | Delete PM2 process |
| `npm run pm2:logs` | View application logs |
| `npm run pm2:monit` | Monitor application |
| `npm run pm2:status` | Check PM2 status |
| `npm run deploy` | Build + Deploy to production |

## 📊 Monitoring

### Check Application Status
```bash
pm2 status
```

### View Logs
```bash
pm2 logs codeschool --lines 100
```

### Monitor in Real-time
```bash
pm2 monit
```

### Health Check
```bash
curl http://localhost:3000/health
```

## 🏃‍♂️ Auto-Startup Configuration

### Option 1: PM2 (Recommended)
```bash
# Save current PM2 processes
pm2 save

# Generate startup script
pm2 startup

# Follow the command shown by PM2 (usually requires sudo)
```

### Option 2: SystemD Service
```bash
# Copy service file
sudo cp codeschool.service /etc/systemd/system/

# Reload systemd
sudo systemctl daemon-reload

# Enable auto-start
sudo systemctl enable codeschool

# Start service
sudo systemctl start codeschool

# Check status
sudo systemctl status codeschool
```

## 🔒 Security Features

- **Helmet.js**: Sets various HTTP headers for security
- **Compression**: Reduces response size
- **Static File Caching**: Improves performance
- **Error Handling**: Prevents server crashes
- **Graceful Shutdown**: Handles termination signals properly

## 📁 File Structure

```
├── server.js              # Production-ready Express server
├── ecosystem.config.js    # PM2 configuration
├── codeschool.service     # SystemD service template
├── .env                   # Environment variables
├── logs/                  # PM2 log files
└── dist/                  # Built frontend files
```

## 🌐 Environment Variables

Create a `.env` file or set environment variables:

```env
NODE_ENV=production
PORT=3000
```

## 🔍 Troubleshooting

### Server Won't Start
```bash
# Check if port is in use
sudo lsof -i :3000

# Check PM2 logs
pm2 logs codeschool
```

### PM2 Issues
```bash
# Restart PM2 daemon
pm2 kill
pm2 start ecosystem.config.js --env production
```

### SystemD Issues
```bash
# Check service status
sudo systemctl status codeschool

# View logs
sudo journalctl -u codeschool -f
```

## 📈 Performance Tips

1. **Use PM2 cluster mode** for multiple CPU cores:
   ```javascript
   // In ecosystem.config.js
   instances: 'max' // or specific number
   ```

2. **Set up Nginx** as reverse proxy for better performance

3. **Enable HTTP/2** and **SSL/TLS** in production

4. **Monitor memory usage** and set `max_memory_restart`

## 🚀 Deployment Checklist

- [ ] Run `npm run build`
- [ ] Set `NODE_ENV=production`
- [ ] Configure PM2 startup script
- [ ] Set up monitoring
- [ ] Configure firewall
- [ ] Set up SSL/TLS
- [ ] Configure domain/DNS
- [ ] Test health endpoint
- [ ] Verify auto-restart functionality

## 📞 Support

For issues or questions, check the logs first:
```bash
npm run pm2:logs
```

The server includes comprehensive error handling and logging to help diagnose issues.