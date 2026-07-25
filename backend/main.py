import logging
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routers import classify, application
from services.kb import load_knowledge_base

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(levelname)s:%(name)s:%(message)s")

app = FastAPI(title="SunoGov API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "https://sunogov.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(classify.router)
app.include_router(application.router)


@app.on_event("startup")
async def startup():
    data_dir = Path(__file__).resolve().parent / "data"
    load_knowledge_base(data_dir)
