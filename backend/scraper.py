import requests
from bs4 import BeautifulSoup
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Repo, Base

Base.metadata.create_all(bind=engine)

def clean_number(num_str):
    """Convert string numbers like '7,364' or '12.5k' to integers"""
    num_str = num_str.strip().lower().replace(',', '')
    if 'k' in num_str:
        num_str = num_str.replace('k', '')
        return int(float(num_str) * 1000)
    return int(num_str)

def scrape_github_trending():
    url = "https://github.com/trending"
    response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, "html.parser")
        repos = []

        for repo_element in soup.find_all("article", class_="Box-row"):
            name = repo_element.find("a", class_="Link")["href"]
            description = repo_element.find("p", class_="col-9").text.strip()
            url = "https://github.com" + name
            stars = clean_number(repo_element.find_all("a", class_="Link--muted")[0].text.strip())
            forks = clean_number(repo_element.find_all("a", class_="Link--muted")[1].text.strip())
            try:
                language = repo_element.find("span", itemprop="programmingLanguage").text.strip()
            except:
                language = "Not Found"
            repos.append({"name": name, "description": description, "stars": stars, "forks": forks, "url": url, "language": language})

        db = SessionLocal()
        for repo in repos:
            new_repo = Repo(name=repo["name"], stars=repo["stars"], url=repo["url"], language=repo["language"])
            db.add(new_repo)
        db.commit()
        db.close()
        print("Scraped and stored trending repos.")
    else:
        print("Failed to fetch GitHub Trending.")

if __name__ == "__main__":
    scrape_github_trending()
