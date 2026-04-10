# Use Python 3.11 slim as the base image
FROM python:3.11-slim

# Set working directory in the container
WORKDIR /app

# Set environment variables
# Prevent Python from writing .pyc files and enable unbuffered logging
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PORT 8000

# Install system dependencies (needed for some Python packages like passlib/bcrypt)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file to the container
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code to the container
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Start the application with uvicorn
# We use the PORT environment variable to make it compatible with Railway
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"]
