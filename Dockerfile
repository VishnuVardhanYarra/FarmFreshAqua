# Production Dockerfile for FarmFreshAqua FastAPI Backend on Render
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install lightweight CPU-only PyTorch & torchvision first
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu

# Copy and install remaining dependencies
COPY requirements.txt .
RUN grep -v -E "^torch|^torchvision" requirements.txt > reqs_no_torch.txt && \
    pip install --no-cache-dir -r reqs_no_torch.txt && \
    rm reqs_no_torch.txt

# Create uploads directory
RUN mkdir -p uploads

# Copy application source
COPY app/ ./app/

# Expose application port
EXPOSE 8000

# Start command (binds to Render's dynamic $PORT or 8000)
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
