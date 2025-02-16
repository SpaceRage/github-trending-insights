"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "../components/ui/card";
import { fetchTrendingRepos } from "../utils/api";

type Repo = {
  id: number;
  name: string;
  description: string;
  url: string;
  stars: number;
  language: string;
};

export default function Home() {
  const [repos, setRepos] = useState<Repo[]>([]);

  useEffect(() => {
    fetchTrendingRepos().then(setRepos);
  }, []);

  console.log(repos);
  return (
    <div className="container p-6">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        GitHub Trending Repos
      </h1>
      <div className="flex flex-col gap-3 mt-6">
        {repos.map((repo) => (
          <Card key={repo.id} className="repo bg-slate-800 p-6 pt-8 pb-0">
            <CardTitle className="text-xl">{repo.name}</CardTitle>
            <CardDescription>{repo.description}</CardDescription>
            <CardContent>
              <p>Stars: {repo.stars}</p>
              <p>Language: {repo.language}</p>
              <a href={repo.url} className="text-blue-500">
                View on GitHub
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
