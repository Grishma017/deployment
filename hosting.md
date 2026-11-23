# Web Application Hosting & DevOps Deployment Guide: Swad - Taste of Nepal
### Production Hosting on AWS EC2 with CloudFormation, Nginx, PM2 & GitHub Actions CI/CD

This document provides a complete, step-by-step **Hosting & Infrastructure Guide** for deploying the **Swad - Taste of Nepal** MERN stack project onto AWS EC2 using Infrastructure-as-Code (CloudFormation) and automated CI/CD (GitHub Actions).

---

## 1. Hosting Architecture Overview

When a visitor opens your website in their browser, here is how traffic flows through the server:

```
                            [ USER / BROWSER ]
                                    │
                                    │ HTTP Request (Port 80)
                                    ▼
                  ┌───────────────────────────────────┐
                  │          AWS EC2 INSTANCE         │
                  │         (Ubuntu 24.04 LTS)        │
                  │                                   │
                  │   ┌───────────────────────────┐   │
                  │   │    NGINX (Reverse Proxy)  │   │
                  │   └─────────────┬─────────────┘   │
                  │                 │                 │
                  │    ┌────────────┴───────────┐     │
                  │    │                        │     │
                  │    ▼                        ▼     │
                  │  Static Files           Backend   │
                  │  (Frontend React)       API (PM2) │
                  │  /var/www/app/frontend  Port 5000 │
                  │  /dist                            │
                  └─────────────────────────────┬─────┘
                                                │
                                                │ Database Connection
                                                ▼
                                    [ CLOUD DATABASE ]
                                    (MongoDB Atlas M0 - 24/7)
```

### Key Principles of this Setup:
1. **Nginx Web Server (Port 80):** The public entry point. It serves the frontend static build files (HTML, JS, CSS) with SPA fallback routing, and reverse-proxies all `/api/*` requests to the internal Express backend.
2. **PM2 Process Manager:** Keeps the Node.js Express backend running continuously in the background on port `5000`. If the server reboots or code crashes, PM2 automatically restarts it.
3. **AWS CloudFormation (Infrastructure-as-Code):** You don't have to manually launch EC2 instances or configure security groups in the AWS Console. A single template (`infra/ec2-instance.yaml`) provisions the EC2 instance and key pair automatically.
4. **AWS Systems Manager (SSM) Parameter Store:** Automatically stores the SSH private key inside AWS. GitHub Actions retrieves it dynamically on every deployment—no manual `.pem` key downloading.
5. **GitHub Actions CI/CD:** Every time you push code to `main`, GitHub tests/builds the frontend, verifies or creates the EC2 server, SSH-es in, updates the code, builds the production assets, and reloads PM2 + Nginx automatically.

---

## 2. Infrastructure Files Configured in This Repository

The repository has been configured with these 4 core infrastructure files:

### File 1: `infra/ec2-instance.yaml`
*CloudFormation template that provisions the EC2 instance, security group, and key pair.*
- Provisions an Ubuntu 24.04 LTS `t2.micro` machine in `us-east-1`.
- Configures Security Group opening Port 80 (HTTP) and Port 22 (SSH).
- Runs UserData script during first boot to install Node.js 22, Git, Nginx, PM2, and clones `https://github.com/Grishma017/deployment.git` to `/var/www/app`.

### File 2: `infra/nginx.conf`
*Nginx web server configuration.*
- Serves compiled React static files from `/var/www/app/frontend/dist`.
- Handles SPA client-side routing (`try_files $uri $uri/ /index.html;`).
- Reverse proxies `/api/` requests to `http://127.0.0.1:5000/api/`.
- Caches CSS, JS, fonts, and images.

### File 3: `backend/ecosystem.config.cjs`
*PM2 configuration to manage and run the backend continuously.*
- Runs `server.js` inside `/var/www/app/backend`.
- Configured with `exec_mode: 'fork'` and `instances: 1` (optimal for single-core `t2.micro` instances).
- Sets `max_memory_restart: '300M'`.

### File 4: `.github/workflows/deploy.yml`
*Automated GitHub Actions CI/CD deployment pipeline.*
- **Build job**: Installs dependencies and builds the Vite frontend bundle.
- **Deploy job**:
  1. Authenticates with AWS credentials.
  2. Deploys or updates the CloudFormation stack `swad-app-stack`.
  3. Retrieves the EC2 Public IP and the SSM SSH key dynamically.
  4. Waits for SSH port 22 to be ready.
  5. Connects via SSH and updates code (`git reset --hard origin/main`).
  6. Generates the production `backend/.env` file from GitHub Secrets.
  7. Installs backend dependencies, builds the frontend, and reloads PM2 and Nginx.
  8. Prints the live URL.

---

## 3. Step-by-Step Setup Guide (From Scratch)

### Step 1: Set Up Cloud Database (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/) and create a free account.
2. Create an **M0 Free Cluster**.
3. Under **Database Access**: Create a database user and password (save this password).
4. Under **Network Access**: Click **Add IP Address** $\rightarrow$ Click **Allow Access from Anywhere (`0.0.0.0/0`)** $\rightarrow$ Confirm.  
   *(Crucial: EC2 IP changes when restarted in student labs; this ensures the server is never blocked).*
5. Under **Database $\rightarrow$ Connect $\rightarrow$ Drivers**: Copy your connection string:
   ```
   mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/swad?retryWrites=true&w=majority
   ```

### Step 2: Collect AWS Credentials (from AWS Learner Lab / VocLabs)
1. In your AWS Learner Lab / VocLabs console: Click **Start Lab** and wait for the circle to turn **green**.
2. Click **AWS Details $\rightarrow$ Show** (next to AWS CLI).
3. Copy the 3 values from the `[default]` block:
   - `aws_access_key_id`
   - `aws_secret_access_key`
   - `aws_session_token`

### Step 3: Configure GitHub Secrets & Variables
In your GitHub repository (`Grishma017/deployment`), open **Settings $\rightarrow$ Secrets and variables $\rightarrow$ Actions**:

#### Add Repository Secrets:
| Secret Name | Value |
|---|---|
| `AWS_ACCESS_KEY_ID` | `ASIA...` (from Step 2) |
| `AWS_SECRET_ACCESS_KEY` | `xxxx...` (from Step 2) |
| `AWS_SESSION_TOKEN` | `FwoGZX...` (full string from Step 2) |
| `MONGODB_URI` | Full connection string (from Step 1) |
| `JWT_SECRET` | Any secure random string (e.g. `swad_jwt_secret_key_2026`) |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary Cloud Name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API Secret |

#### Add Repository Variable:
Click the **Variables** tab (next to Secrets) $\rightarrow$ Click **New repository variable**:
- Name: `AWS_REGION`
- Value: `us-east-1`

### Step 4: Push to GitHub & Trigger Deployment
Run the following commands in your project root:
```bash
git add .
git commit -m "feat(hosting): configure AWS CloudFormation, Nginx, PM2, and CI/CD"
git push origin main
```

### Step 5: Verify Live Website
1. Go to your GitHub repository and click the **Actions** tab.
2. Select the running **Deploy Web Application (CloudFormation + SSH)** workflow.
3. First deployment takes ~5–7 minutes to provision the EC2 instance and bootstrap services.
4. Once completed, expand the **Print Live Web Application URL** step and click the link (e.g. `http://54.x.x.x`) to view your live application.

---

## 4. Handling AWS Lab Expiration & Automatic Server Recovery

In student environments (VocLabs / AWS Academy), sessions automatically expire after 4 hours.

### What happens when the lab times out?
AWS shuts down the virtual machine and revokes the temporary credentials.

### How to bring your website back up in 60 seconds:
1. Open the lab and click **Start Lab**.
2. Click **AWS Details $\rightarrow$ Show** and copy the new `[default]` keys.
3. Update `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_SESSION_TOKEN` in GitHub Secrets.
4. Go to **Actions** in GitHub and click **Re-run all jobs**.
5. CloudFormation automatically finds or recreates your instance, updates the IP, and brings your site back online!

---

## 5. Live Server Maintenance & Useful Commands

Connect to your EC2 instance via **EC2 Instance Connect** in the AWS Console and run these commands to inspect the live server:

```bash
# Check if the Node.js backend is running
pm2 status

# View live backend error and console logs
pm2 logs --lines 50

# Restart backend with fresh environment variables
pm2 restart all --update-env

# View real-time incoming web traffic through Nginx
sudo tail -f /var/log/nginx/access.log

# View Nginx web server error logs
sudo tail -f /var/log/nginx/error.log

# Test Nginx syntax and reload after configuration changes
sudo nginx -t && sudo systemctl reload nginx
```
