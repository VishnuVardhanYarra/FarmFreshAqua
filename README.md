---
title: FarmFreshAqua API
emoji: 🦐
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
pinned: false
---

# FarmFreshAqua - Smart Aquaculture Disease Detection & Farmer Platform

A full-stack aquaculture platform providing prawn disease detection with deep learning (PyTorch ResNet-50), water quality monitoring, market linkage, and farmer dashboards.

## Architecture

- **Backend**: FastAPI with PyTorch & torchvision (ResNet-50)
- **Frontend**: React (Vite)
- **Database**: PostgreSQL (Neon Serverless Postgres)
- **Hosting**:
  - Backend: Hugging Face Spaces (Docker, 2 vCPU, 16GB RAM - 100% Free)
  - Frontend: Vercel / Render Static Site (100% Free)
  - Database: Neon.tech (100% Free forever)

## API Endpoints

- `GET /` - Root status
- `GET /health` - Health check endpoint
- `POST /auth/register` - User registration (farmer / buyer)
- `POST /auth/login` - User authentication (JWT)
- `GET /auth/profile` - Profile lookup
- `POST /images/predict` - AI Prawn Disease prediction from image
