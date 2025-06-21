# Use official Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy only requirements first (better caching)
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your app
COPY . .

# Expose port
EXPOSE 3000

# Run the app
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "3000"]

