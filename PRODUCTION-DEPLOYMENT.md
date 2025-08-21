# Production Deployment Guide

## Prerequisites

- Netlify account connected to GitHub
- Neon database setup
- Environment variables configured

## Step-by-Step Deployment

### 1. Environment Variables Setup in Netlify

Go to your Netlify site dashboard > Site settings > Environment variables and add:

```bash
# Database
DATABASE_URL=postgresql://neondb_owner:npg_Cxy1BMlUHT8D@ep-calm-surf-aenze1uk-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require

# Authentication (GENERATE NEW SECURE KEYS!)
JWT_SECRET=your_production_jwt_secret_minimum_32_characters_long_secure_random_string
SESSION_SECRET=your_production_session_secret_minimum_32_characters_long_secure_random_string

# Environment
NODE_ENV=production
```

### 2. Generate Secure Keys

Use these commands to generate secure keys:

```bash
# For JWT_SECRET (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# For SESSION_SECRET (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Database Migration

Ensure your database is migrated with the latest schema:

```bash
npx prisma migrate deploy
```

### 4. Default Admin User

The system will automatically create a default admin user on first login attempt:

- Username: `admin`
- Password: `admin123`

**IMPORTANT**: Change these credentials immediately after first login in production!

### 5. Security Checklist

- ✅ Secure JWT and Session secrets set
- ✅ HTTPS enabled (automatic with Netlify)
- ✅ HTTP-only cookies configured
- ✅ Database connection secured with SSL
- ✅ Environment variables properly set
- ✅ Default credentials changed

### 6. Testing Production

1. Deploy to Netlify
2. Visit your site URL
3. Should redirect to `/login`
4. Login with default credentials
5. Change default credentials immediately

### 7. Domain Configuration (Optional)

If using a custom domain:

1. Configure domain in Netlify
2. Update cookie domain in auth configuration
3. Test authentication flow

## Troubleshooting

### Common Issues:

1. **Database Connection**: Ensure DATABASE_URL is correctly set in Netlify
2. **Authentication Errors**: Verify JWT_SECRET and SESSION_SECRET are set
3. **Cookie Issues**: Check domain configuration for custom domains
4. **Migration Errors**: Run `npx prisma migrate deploy` manually

### Logs:

- Netlify Functions logs: Site dashboard > Functions
- Build logs: Site dashboard > Deploys

## Security Notes

- Never commit real environment variables to GitHub
- Use strong, unique passwords for production
- Regularly rotate JWT secrets
- Monitor authentication logs
- Keep dependencies updated
