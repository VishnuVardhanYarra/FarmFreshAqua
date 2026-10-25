# Production Dockerfile for FarmFreshAqua FastAPI Backend (Hugging Face Spaces & Docker hosts)
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=7860

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

# Copy requirements and install remaining dependencies
COPY requirements.txt .
RUN grep -v -E "^torch|^torchvision" requirements.txt > reqs_no_torch.txt && \
    pip install --no-cache-dir -r reqs_no_torch.txt && \
    rm reqs_no_torch.txt

# Create non-root user (UID 1000) for Hugging Face Spaces compatibility
RUN useradd -m -u 1000 user && \
    mkdir -p /app/uploads && \
    chown -R user:user /app

# Switch to non-root user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# Copy application code
COPY --chown=user:user app/ ./app/

# Expose default port
EXPOSE 7860

# Start command
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-7860}"]
