from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import gpa

app = FastAPI(title="GPA Calculator API", version="1.0.0")

# Cấu hình CORS để Frontend (React) có thể gọi được API
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173", # Mặc định của Vite
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(gpa.router, prefix="/api/gpa", tags=["GPA"])

@app.get("/")
def read_root():
    return {"message": "Welcome to GPA Calculator API. Go to /docs for Swagger UI."}