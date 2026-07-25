import logging
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routers import classify, application
from services.kb import load_knowledge_base

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(levelname)s:%(name)s:%(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(title="SunoGov API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(classify.router)
app.include_router(application.router)


@app.get("/")
async def root():
    return {"status": "ok", "service": "SunoGov API"}


@app.on_event("startup")
async def startup():
    try:
        data_dir = Path(__file__).resolve().parent / "data"
        load_knowledge_base(data_dir)
        logger.info("Knowledge base loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load knowledge base: {e}")
        raise
