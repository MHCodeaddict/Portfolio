import React, { useEffect, useState} from 'react';
import { Paper, Typography, Box } from "@mui/material";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";

//Function processes thumbnails for project paper cards
function getProjectThumbnail(project: myData): string | null {
  if (project.image) return project.image;

  //GitHub links
  if (project.link.includes("github.com")) {
    const path = project.link.replace("https://github.com/", "");
    return `https://opengraph.githubassets.com/1/${path}`;
  }

  //YouTube links
  if (project.link.includes("youtube.com") || project.link.includes("youtu.be")) {
    let videoId: string | null = null;

    if (project.link.includes("youtube.com")) {
      const urlParams = new URL(project.link).searchParams;
      videoId = urlParams.get("v");
    } else if (project.link.includes("youtu.be")) {
      videoId = project.link.split("/").pop() || null;
    }

    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
  }

  return null;
}

//function to build the paper card per project
function ProjectCard({ project }: { project: myData }) {
  const thumbnail = getProjectThumbnail(project);

  return (
    <Paper
      component="a"
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      elevation={3}
      sx={{
        textDecoration: "none",
        color: "inherit",
        backgroundColor: "background.color",
        border: "4px solid",
        borderColor: "grey.900",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        cursor: "pointer",
        "&:hover": { boxShadow: 10 },
      }}
    >
      {/* Title */}
      <Box sx={{ p: 2, borderBottom: "4px solid", borderColor: "grey.900" }}>
        <Typography variant="h6" fontWeight={600} color="blue">
          {project.title}
        </Typography>
      </Box>

      {/* Image */}
      <Box
        sx={{
          flexGrow: 1,
          borderBottom: "4px solid",
          borderColor: "grey.900",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={project.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            No Preview
          </Typography>
        )}
      </Box>

      {/* Description */}
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {project.description}
        </Typography>
      </Box>
    </Paper>
  );
}
// Types for your portfolio data
interface myData {
  id: number;
  title: string;
  description: string;
  link: string;
  image?: string;
}

interface ProfileData {
  name: string;
  email: string;
  bio: string;
  headshot: string;
  githubLink: string;
  projects: myData[];
}

function App() {
const [profile, setProfile] = useState<ProfileData | null>(null);

useEffect(() => {
  fetch("/assets/myData.json")
    .then(res => res.json())
    .then((data: ProfileData) => {
      setProfile(data);
    });
}, []);

    if(!profile){
      return <div>loading....</div>
    }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                <span className="text-gray-500 text-sm">Face Photo</span>
              </div>
            </div>

            {/* Name and Bio */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {profile.name}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {profile.email}
              </p>
              <div className="bg-white border-2 border-gray-300 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed">
                  {profile.bio}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Projects Section */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">My Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600">
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;