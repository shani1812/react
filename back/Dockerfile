# Use the official FastAPI Uvicorn Gunicorn image
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.11

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements.txt file to the container
COPY requirements.txt .

# Install dependencies from requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the FastAPI application files into the container
COPY . .

# Expose port 8000 (FastAPI will now run on this port)
EXPOSE 8000

# Uvicorn automatically starts the FastAPI app, so we specify the port here
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
