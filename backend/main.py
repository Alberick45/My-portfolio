import os
import json
import shutil
import tempfile
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

app = FastAPI(title="Albert Portfolio Backend", version="1.0.0")

# Setup CORS for the React front-end (typically runs on http://localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
POSTS_FILE = os.path.join(BASE_DIR, "posts.json")
PUBLIC_IMAGES_DIR = os.path.join(os.path.dirname(BASE_DIR), "public", "images")

# Load environment variables from the project root's .env file
dotenv_path = os.path.join(os.path.dirname(BASE_DIR), ".env")
load_dotenv(dotenv_path=dotenv_path)

# Fallback: load from CWD or default locations
if not os.path.exists(dotenv_path):
    load_dotenv()

# Ensure directories exist
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(PUBLIC_IMAGES_DIR, exist_ok=True)

# Mount static directory for uploaded files (fallback/general)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Configure Cloudinary using environment variables
cloudinary.config( 
  cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"), 
  api_key = os.getenv("CLOUDINARY_API_KEY"), 
  api_secret = os.getenv("CLOUDINARY_API_SECRET") 
)

class BlogPost(BaseModel):
    id: str
    title: str
    excerpt: str
    content: str
    date: str
    readTime: str
    category: str
    categoryColor: str
    gradient: str

def load_posts() -> List[dict]:
    if not os.path.exists(POSTS_FILE):
        return []
    try:
        with open(POSTS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []

def save_posts(posts: List[dict]):
    with open(POSTS_FILE, "w", encoding="utf-8") as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)

@app.get("/api/posts", response_model=List[BlogPost])
async def get_posts():
    return load_posts()

@app.post("/api/posts", response_model=List[BlogPost])
async def update_posts(posts: List[BlogPost]):
    posts_data = [post.dict() for post in posts]
    save_posts(posts_data)
    return posts_data

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    # Validate extension type
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".png", ".jpg", ".jpeg", ".gif", ".webp", ".mp4", ".mov", ".avi", ".mkv", ".webm"]:
        raise HTTPException(status_code=400, detail="Unsupported file format.")
    
    is_video = ext in [".mp4", ".mov", ".avi", ".mkv", ".webm"] or file.content_type.startswith("video/")

    if is_video:
        # Video goes to Cloudinary
        try:
            # Save to temporary file first so uploader can read it
            with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as temp_file:
                shutil.copyfileobj(file.file, temp_file)
                temp_path = temp_file.name

            # Upload large file chunked (suitable for videos)
            upload_result = cloudinary.uploader.upload_large(
                temp_path,
                resource_type="video",
                folder="portfolio_videos"
            )
            
            # Clean up temp file
            if os.path.exists(temp_path):
                os.remove(temp_path)
                
            return {"url": upload_result["secure_url"], "filename": file.filename, "source": "cloudinary"}
        except Exception as e:
            # Fall back to local public directory if Cloudinary credentials or upload fails
            print(f"Cloudinary upload failed: {str(e)}. Falling back to local storage.")
            filename = f"upload_{os.urandom(8).hex()}{ext}"
            filepath = os.path.join(PUBLIC_IMAGES_DIR, filename)
            
            try:
                # Seek to start since file was read into temp_file
                file.file.seek(0)
                with open(filepath, "wb") as buffer:
                    shutil.copyfileobj(file.file, buffer)
            except Exception as local_e:
                raise HTTPException(status_code=500, detail=f"Cloudinary upload failed, and local fallback failed: {str(local_e)}")
                
            file_url = f"/images/{filename}"
            return {"url": file_url, "filename": filename, "source": "local_public"}
    else:
        # Image goes to local GitHub-tracked public/images/ directory
        filename = f"upload_{os.urandom(8).hex()}{ext}"
        filepath = os.path.join(PUBLIC_IMAGES_DIR, filename)
        
        try:
            with open(filepath, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Could not save file to disk: {str(e)}")
            
        # Return path relative to the public root
        file_url = f"/images/{filename}"
        return {"url": file_url, "filename": filename, "source": "local_public"}

