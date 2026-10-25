---
title: FarmFreshAqua API
emoji: 🦐
colorFrom: blue
colorTo: green
sdk: gradio
sdk_version: 5.20.0
app_file: app.py
pinned: false
---

# FarmFreshAqua - Smart Aquaculture Disease Detection & Farmer Platform

A full-stack aquaculture platform providing prawn disease detection with deep learning (PyTorch ResNet-50), water quality monitoring, market linkage, and farmer dashboards.

## Architecture

- **Backend**: FastAPI mounted with Gradio UI, PyTorch & torchvision (ResNet-50)
- **Frontend**: React (Vite)
- **Database**: PostgreSQL (Neon Serverless Postgres)
- **Hosting**:
  - Backend: Hugging Face Spaces (Gradio SDK, 2 vCPU, 16GB RAM - 100% Free with zero payment)
  - Frontend: Vercel (100% Free)
  - Database: Neon.tech (100% Free forever)

## API Endpoints

- `GET /` - Gradio UI and interactive API status
- `GET /health` - Health check endpoint
- `POST /auth/register` - User registration (farmer / buyer)
- `POST /auth/login` - User authentication (JWT)
- `GET /auth/profile` - Profile lookup
- `POST /images/predict` - AI Prawn Disease prediction from image
