# 10. Installation & Deployment Guide
**EduStay: Karunya University Smart Hostel Management Portal**

---

## 10.1 System Prerequisites
- **Node.js**: v18.18+ or v20+ (Tested on v24.19.0).
- **PostgreSQL**: PostgreSQL 14+ (Tested natively on PostgreSQL 16.15).
- **Package Manager**: npm or pnpm.

---

## 10.2 Local Development Setup

### Step 1: Clone and Install Dependencies
```bash
git clone <repository-url>
cd edustay
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure your `DATABASE_URL` points to your PostgreSQL server:
```env
DATABASE_URL="postgresql://postgres@localhost:5433/edustay?schema=public"
JWT_SECRET="edustay-karunya-secret-key-2026-very-secure-jwt-token"
PORT=3000
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 3: Run Database Migrations and Seed
```bash
# Push Prisma schema to PostgreSQL database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Seed realistic Karunya university demonstration dataset
npm run db:seed
```

### Step 4: Execute Automated Test Suite
```bash
npm run test
```
All 5 test suites (13 unit & integration tests) will execute and report passing status.

### Step 5: Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 10.3 Pre-configured Demonstration Accounts

All accounts use the standard password: `karunya123`

| Persona | Identifier / Code | Institutional Role | Primary Responsibilities |
| :--- | :--- | :--- | :--- |
| **Jabez Gabrielraj E** | `URK25CS6015` | `STUDENT` | Main reference student in Father Duraisamy Hostel Room 204 |
| **Samuel Johnson K** | `URK25CS6016` | `STUDENT` | Roommate of Jabez sharing Room 204 (Bed B) |
| **Mr. D. Joseph** | `SRA001` | `SRA` | Student Resident Advisor for Father Duraisamy Wing A |
| **Dr. R. Philip** | `MENTOR01` | `MENTOR` | Faculty Mentor for CSE Department students |
| **Dr. K. Samuel** | `WARDEN01` | `WARDEN` | Chief Warden of Men's Residences |
| **Dr. C. Andrews** | `HADMIN01` | `HOSTEL_ADMIN` | Director of Student Residences & Allocation Manager |
| **Administrative Officer** | `SYSADMIN` | `SYSTEM_ADMIN` | CIT System Administrator & Audit Oversight |

---

## 10.4 Production Deployment on Managed Platforms (Vercel + Neon / Supabase)

1. **Database Deployment**:
   - Provision a PostgreSQL database on Neon (`neon.tech`) or Supabase (`supabase.com`).
   - Copy the connection pooling connection string to `DATABASE_URL`.
2. **Environment Variables**:
   - Set `DATABASE_URL` and a cryptographically random `JWT_SECRET` in project settings.
3. **Build & Deploy**:
   - Run `prisma db push` and `prisma generate` during build step.
   - Deploy Next.js App Router application to Vercel or any containerized Docker host.

