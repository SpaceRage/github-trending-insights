"use client";

import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
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
  forks: number;
  language: string;
};

type LanguageData = {
  name: string;
  value: number;
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function Home() {
  const [repos, setRepos] = useState<Repo[]>([]);

  useEffect(() => {
    fetchTrendingRepos().then(setRepos);
  }, []);

  const languageData = repos.reduce((acc: LanguageData[], repo) => {
    if (!repo.language) return acc;

    const existingLanguage = acc.find((item) => item.name === repo.language);
    if (existingLanguage) {
      existingLanguage.value += 1;
    } else {
      acc.push({ name: repo.language, value: 1 });
    }
    return acc;
  }, []);

  return (
    <div className="container p-6 mx-auto">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        GitHub Trending Repos
      </h1>
      <div className="flex flex-col lg:flex-row justify-between gap-10 mt-6 w-full ">
        <div className="flex flex-col gap-3 mt-6 ">
          {repos.map((repo) => (
            <Card key={repo.id} className="repo bg-slate-800 p-6 pt-6 pb-0">
              <CardTitle className="text-xl">{repo.name}</CardTitle>
              <CardDescription>{repo.description}</CardDescription>
              <CardContent className="flex flex-row gap-2 pl-0">
                <p>Stars: {repo.stars}</p>
                <p>Forks: {repo.forks}</p>
                <p>Language: {repo.language}</p>
                <a href={repo.url} className="text-blue-500">
                  View on GitHub
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8">
          <PieChart width={600} height={400}>
            <Pie
              data={languageData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label={(entry) => entry.name}
              labelLine={false}
            >
              {languageData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>
    </div>
  );
}
