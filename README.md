# FarmFreshAqua

A full-stack aquaculture platform providing prawn disease detection with deep learning (PyTorch ResNet-50), water quality monitoring, market linkage, and farmer dashboards.

## Architecture

- **Backend**: FastAPI with PyTorch & torchvision (Quantized ResNet-50)
- **Frontend**: React (Vite)
- **Database**: PostgreSQL (Neon Serverless Postgres)
- **Deployment**:
  - Backend: Render Native Python Web Service 
  - Frontend: Vercel
  - Database: Neon.tech PostgreSQL

## API Endpoints

- `GET /` - Root status
- `GET /health` - Health check endpoint
- `POST /auth/register` - User registration (farmer / buyer)
- `POST /auth/login` - User authentication (JWT)
- `GET /auth/profile` - Profile lookup
- `POST /images/predict` - AI Prawn Disease prediction from image
