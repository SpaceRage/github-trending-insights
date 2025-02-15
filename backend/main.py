from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Repo

app = FastAPI()

@app.get("/trending")
def get_trending_repos(db: Session = Depends(get_db)):
    repos = db.query(Repo).all()
    return {"trending_repos": repos}
