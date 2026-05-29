import React, { useState } from "react";
import { Plus, Trash2, Download, FileText, FolderPlus } from "lucide-react";
import JSZip from "jszip";
import * as YAML from "yaml";

// --- TYPES TS ---
interface Track {
  title: string;
  slug: string;
  duration: string;
  halfDays: string;
  childrenInput: string; // Pour saisir les sous-modules séparés par des virgules
}

interface BootcampData {
  title: string;
  slug: string;
  topic: string;
  level: string;
  pathLevel: string;
  duration: string;
  access: string;
  introductionVideoId: string;
  schedule: string;
  description: string;
  goalsInput: string;
  prerequisitesInput: string;
  tagsInput: string;
}

export default function App() {
  // --- STATE ---
  const [bootcamp, setBootcamp] = useState<BootcampData>({
    title: "Cybersecurity Full Stack",
    slug: "cyber-fullstack-fulltime-v3",
    topic: "cyber security",
    level: "Medium",
    pathLevel: "fullstack",
    duration: "12 weeks",
    access: "cyber-fullstack-full-time",
    introductionVideoId: "783730902",
    schedule: "both",
    description: "Welcome to the cybersecurity fullstack program...",
    goalsInput: "Master Python scripting, Use and secure SQL databases",
    prerequisitesInput: "Be comfortable with Python, Know the basics of IT",
    tagsInput: "shell, cybersecurity, network, linux",
  });

  const [tracks, setTracks] = useState<Track[]>([
    {
      title: "Threat Intelligence",
      slug: "threat-intelligence-cybfs",
      duration: "2 days",
      halfDays: "4",
      childrenInput:
        "understand-threat-intelligence-cybfs, introduction-to-threat-intel-cybfs",
    },
  ]);

  // --- LOGIQUE DE SOUFFLAGE DE SLUG AUTOMATIQUE ---
  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setBootcamp({ ...bootcamp, title, slug: `${slug}-v3` });
  };

  const handleTrackTitleChange = (index: number, title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const newTracks = [...tracks];
    newTracks[index].title = title;
    newTracks[index].slug = `${slug}-cybfs`; // Suffixe customisable
    setTracks(newTracks);
  };

  // --- AJOUT / SUPPRESSION DE MODULES ---
  const addTrack = () => {
    setTracks([
      ...tracks,
      {
        title: "",
        slug: "",
        duration: "2 days",
        halfDays: "4",
        childrenInput: "",
      },
    ]);
  };

  const removeTrack = (index: number) => {
    setTracks(tracks.filter((_, i) => i !== index));
  };

  // --- GÉNÉRATION DU ZIP ---
  const handleGenerate = async () => {
    const zip = new JSZip();

    // 1. Préparation des données du Root (Path)
    const rootYamlData = {
      access: bootcamp.access,
      children: tracks.map((t) => t.slug).filter((slug) => slug !== ""),
      description: bootcamp.description,
      duration: bootcamp.duration,
      goals: bootcamp.goalsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      introductionVideoId: bootcamp.introductionVideoId,
      kind: "path",
      level: bootcamp.level,
      pathLevel: bootcamp.pathLevel,
      prerequisites: bootcamp.prerequisitesInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      schedule: bootcamp.schedule,
      slug: bootcamp.slug,
      tags: bootcamp.tagsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      title: bootcamp.title,
      topic: bootcamp.topic,
    };

    // Ajout du root.yaml
    zip.file(
      "root.yaml",
      YAML.stringify(rootYamlData, { indent: 2, lineWidth: 0 }),
    );

    // 2. Préparation et ajout des sous-modules (Tracks)
    tracks.forEach((track) => {
      if (!track.slug) return;

      const trackYamlData = {
        children: track.childrenInput
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        duration: track.duration,
        halfDays: track.halfDays,
        kind: "track",
        slug: track.slug,
        title: track.title,
      };

      // Création de l'arborescence : slug_du_module/slug_du_module.yaml
      zip.file(
        `${track.slug}/${track.slug}.yaml`,
        YAML.stringify(trackYamlData, { indent: 2, lineWidth: 0 }),
      );
    });

    // 3. Téléchargement du ZIP
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${bootcamp.slug || "bootcamp"}-config.zip`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px",
        color: "#333",
      }}
    >
      <header
        style={{
          borderBottom: "2px solid #eee",
          paddingBottom: "10px",
          marginBottom: "20px",
        }}
      >
        <h2>📦 Générateur de Configuration Bootcamp (YAML)</h2>
        <p style={{ color: "#666" }}>
          Remplissez le formulaire pour générer l'arborescence complète prête à
          être glissée dans GitHub.
        </p>
      </header>

      {/* --- SECTION PATH (ROOT) --- */}
      <section
        style={{
          background: "#f9f9f9",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h3
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: 0,
          }}
        >
          <FileText size={20} /> Configuration Globale (Root)
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              Titre du Bootcamp
            </label>
            <input
              type="text"
              value={bootcamp.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              Slug (Généré)
            </label>
            <input
              type="text"
              value={bootcamp.slug}
              readOnly
              style={{
                width: "100%",
                padding: "8px",
                boxSizing: "border-box",
                background: "#e9e9e9",
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              Topic
            </label>
            <input
              type="text"
              value={bootcamp.topic}
              onChange={(e) =>
                setBootcamp({ ...bootcamp, topic: e.target.value })
              }
              style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              Durée globale
            </label>
            <input
              type="text"
              value={bootcamp.duration}
              onChange={(e) =>
                setBootcamp({ ...bootcamp, duration: e.target.value })
              }
              style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            />
          </div>
        </div>

        <div style={{ marginTop: "15px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: "5px",
            }}
          >
            Description
          </label>
          <textarea
            rows={4}
            value={bootcamp.description}
            onChange={(e) =>
              setBootcamp({ ...bootcamp, description: e.target.value })
            }
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginTop: "15px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: "5px",
            }}
          >
            Objectifs (Séparés par des virgules)
          </label>
          <input
            type="text"
            value={bootcamp.goalsInput}
            onChange={(e) =>
              setBootcamp({ ...bootcamp, goalsInput: e.target.value })
            }
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
      </section>

      {/* --- SECTION TRACKS (MODULES) --- */}
      <section
        style={{
          background: "#fff",
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              margin: 0,
            }}
          >
            <FolderPlus size={20} /> Modules (Tracks)
          </h3>
          <button
            onClick={addTrack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              background: "#007bff",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            <Plus size={16} /> Ajouter un module
          </button>
        </div>

        {tracks.map((track, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #eee",
              padding: "15px",
              borderRadius: "6px",
              marginBottom: "15px",
              background: "#fcfcfc",
              position: "relative",
            }}
          >
            <button
              onClick={() => removeTrack(index)}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "none",
                border: "none",
                color: "#dc3545",
                cursor: "pointer",
              }}
            >
              <Trash2 size={18} />
            </button>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
                width: "90%",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                >
                  Nom du Module
                </label>
                <input
                  type="text"
                  value={track.title}
                  onChange={(e) =>
                    handleTrackTitleChange(index, e.target.value)
                  }
                  style={{ width: "100%", padding: "6px" }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                >
                  Slug Module (Généré)
                </label>
                <input
                  type="text"
                  value={track.slug}
                  readOnly
                  style={{
                    width: "100%",
                    padding: "6px",
                    background: "#e9e9e9",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                >
                  Durée (ex: 2 days)
                </label>
                <input
                  type="text"
                  value={track.duration}
                  onChange={(e) => {
                    const n = [...tracks];
                    n[index].duration = e.target.value;
                    setTracks(n);
                  }}
                  style={{ width: "100%", padding: "6px" }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                >
                  Demi-journées
                </label>
                <input
                  type="text"
                  value={track.halfDays}
                  onChange={(e) => {
                    const n = [...tracks];
                    n[index].halfDays = e.target.value;
                    setTracks(n);
                  }}
                  style={{ width: "100%", padding: "6px" }}
                />
              </div>
            </div>

            <div style={{ marginTop: "10px" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "bold",
                  marginBottom: "5px",
                }}
              >
                Enfants / Chapitres (Séparés par des virgules)
              </label>
              <input
                type="text"
                value={track.childrenInput}
                placeholder="chapitre-1, chapitre-2"
                onChange={(e) => {
                  const n = [...tracks];
                  n[index].childrenInput = e.target.value;
                  setTracks(n);
                }}
                style={{ width: "100%", padding: "6px" }}
              />
            </div>
          </div>
        ))}
      </section>

      {/* --- BOUTON DE GENERATION D'ACTION --- */}
      <button
        onClick={handleGenerate}
        style={{
          width: "100%",
          background: "#28a745",
          color: "white",
          border: "none",
          padding: "15px",
          fontSize: "18px",
          borderRadius: "8px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <Download size={22} /> Générer et Télécharger le projet (.ZIP)
      </button>
    </div>
  );
}
