# Deployment Guide for NestJS My Store App

## Prerequisites

- Git account (GitHub, GitLab, or Bitbucket)
- Deployment platform account (choose one below)

---

## 🚀 Option 1: Deploy to Render (Recommended)

Render is perfect for your app because:

- ✅ Persistent file system (SQLite database works)
- ✅ Free tier available
- ✅ Easy deployment from Git
- ✅ Always-on server

### Step-by-Step Instructions:

#### 1. Prepare Your Code

```bash
# Make sure all changes are committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### 2. Create Render Account

- Go to https://render.com
- Sign up with GitHub/GitLab
- Click "New +" → "Web Service"

#### 3. Connect Your Repository

- Select your `nest-my-store-api` repository
- Click "Connect"

#### 4. Configure Your Service

Fill in the following:

- **Name:** `my-store-api` (or any name you prefer)
- **Region:** Choose closest to your users
- **Branch:** `main` (or your default branch)
- **Root Directory:** Leave blank
- **Runtime:** `Node`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run start:prod`
- **Instance Type:** `Free`

#### 5. Add Environment Variables

Click "Advanced" → "Add Environment Variable":

```
NODE_ENV=production
SESSION_SECRET=your-super-secret-key-here-change-this
PORT=3000
```

**Important:** Generate a strong SESSION_SECRET:

```bash
# Run this in your terminal to generate a random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 6. Deploy

- Click "Create Web Service"
- Wait 5-10 minutes for deployment
- Your app will be live at: `https://your-app-name.onrender.com`

#### 7. Test Your Deployment

- Visit: `https://your-app-name.onrender.com/mystore/home`
- Sign up and test all features

---

## 🌐 Option 2: Deploy to Railway

Railway is another great option with similar benefits.

### Step-by-Step Instructions:

#### 1. Create Railway Account

- Go to https://railway.app
- Sign up with GitHub
- Click "New Project" → "Deploy from GitHub repo"

#### 2. Select Your Repository

- Choose `nest-my-store-api`
- Railway will auto-detect it's a Node.js app

#### 3. Configure Environment Variables

In Railway dashboard:

- Click on your service
- Go to "Variables" tab
- Add:

```
NODE_ENV=production
SESSION_SECRET=your-super-secret-key-here
```

#### 4. Configure Build Settings

Railway auto-detects, but verify:

- Build Command: `npm run build`
- Start Command: `npm run start:prod`

#### 5. Deploy

- Railway will automatically deploy
- You'll get a URL like: `https://your-app.up.railway.app`

---

## 🐳 Option 3: Deploy with Docker (Advanced)

If you want to use Docker, here's a basic Dockerfile:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

Build and run:

```bash
docker build -t my-store-api .
docker run -p 3000:3000 -e SESSION_SECRET=your-secret my-store-api
```

---

## ⚠️ Important Notes

### Database Persistence

- **Render/Railway:** Your SQLite database will persist on the free tier
- **Warning:** On free tier, services may sleep after inactivity. Database will remain intact.

### File Uploads

- Uploaded images are stored in `/public/images`
- These will persist on Render/Railway
- For production, consider using cloud storage (AWS S3, Cloudinary)

### Session Secret

- **NEVER** use the default session secret in production
- Generate a strong random secret
- Keep it secure and don't commit it to Git

### HTTPS

- Both Render and Railway provide free HTTPS
- Your app automatically uses `secure: true` for cookies in production

---

## 🔧 Troubleshooting

### App won't start

- Check build logs in deployment platform
- Verify all dependencies are in `package.json`
- Ensure `start:prod` script exists

### Database errors

- Make sure the app has write permissions
- Check if `mystore.db` is being created
- Verify TypeORM configuration

### Session issues

- Verify SESSION_SECRET is set
- Check if `sessions` table is created in database
- Ensure cookies are being sent (check browser dev tools)

### Image uploads not working

- Verify `/public/images` directory exists
- Check write permissions on deployment platform
- Consider using cloud storage for production

---

## 📊 Monitoring Your App

Both Render and Railway provide:

- Real-time logs
- CPU/Memory usage
- Request metrics
- Restart capabilities

---

## 🔄 Continuous Deployment

Both platforms support automatic deployments:

- Every push to `main` branch triggers a new deployment
- No manual intervention needed
- Rollback available if deployment fails

---

## 💰 Cost Considerations

### Free Tier Limitations:

- **Render Free:**
  - App sleeps after 15 mins of inactivity
  - 750 hours/month
  - Slower cold starts
- **Railway Free:**
  - $5/month free credit
  - No sleep
  - Better performance

### Upgrading:

- Paid plans start at $7-20/month
- Better performance
- No sleep
- More resources

---

## 🎯 Next Steps After Deployment

1. ✅ Test all features on production
2. ✅ Set up custom domain (optional)
3. ✅ Configure environment-specific settings
4. ✅ Set up monitoring/alerts
5. ✅ Consider migrating to PostgreSQL for production
6. ✅ Add cloud storage for images (AWS S3, Cloudinary)
7. ✅ Set up backup strategy for database

---

## Need Help?

- Render Docs: https://render.com/docs
- Railway Docs: https://docs.railway.app
- NestJS Deployment: https://docs.nestjs.com/faq/serverless

Good luck with your deployment! 🚀
