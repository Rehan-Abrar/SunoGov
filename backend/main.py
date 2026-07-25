from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import classify
from services.kb import load_knowledge_base

app = FastAPI(title="SunoGov API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(classify.router)


@app.on_event("startup")
async def startup():
    data_dir = Path(__file__).resolve().parent / "data"
    load_knowledge_base(data_dir)
