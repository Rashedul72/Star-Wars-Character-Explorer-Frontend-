"use client";

import React, { useState,useEffect  } from "react";
import {
  fetchCharacterByName,
  fetchHomeworld,
  fetchSpeciesForCharacter,
  fetchFilmsForCharacter
} from "./starWarsService";

export default function CharacterSearch() {
  const [query, setQuery] = useState("");
  const [character, setCharacter] = useState(null);
  const [homeworld, setHomeworld] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [species, setSpecies] = useState(null);
  const [films, setFilms] = useState([]);


  useEffect(() => {
  if (query.trim() === "") {
    setCharacter(null);
    setHomeworld(null);
    setSpecies(null);
    setFilms([]);
    setError("");
  }
}, [query]);

const handleSearch = async (e) => {
  e.preventDefault();


  setLoading(true);
  setError("");
  setCharacter(null);
  setHomeworld(null);
  setSpecies(null);
  setFilms([]);

  try {
    const charData = await fetchCharacterByName(query);
    setCharacter(charData);

    if (charData.homeworld) {
      const planet = await fetchHomeworld(charData.homeworld);
      setHomeworld(planet);
    }

    const species = await fetchSpeciesForCharacter(charData.url);
    if (species) setSpecies(species);

    const matchedFilms = await fetchFilmsForCharacter(charData.url);
    setFilms(matchedFilms);
  } catch (err) {
    setError(err.message || "Character or related data not found.");
  } finally {
    setLoading(false);
  }
};


return (
  <main
    className="min-h-screen bg-black text-white"
    style={{
      backgroundImage: `url('https://pub-40025baebb284fd3b1181a1c36e650eb.r2.dev/starwar.jpg ')`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed', 
    }}
  >
    {/* Scrollable Content Container */}
    <div className="min-h-screen bg-black/70 overflow-y-auto max-h-screen px-4 py-10 sm:px-8">
      <div className="max-w-5xl mx-auto animate-fadeIn">
        <h1 className="text-6xl font-extrabold text-center mb-12 text-yellow-400 drop-shadow-lg tracking-wide">
         Star Wars Character Explorer
        </h1>

        {/* Search Form */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-12 items-center justify-center animate-slideInUp">
            {/* Input Field with Star Wars Glow */}
            <div className="relative w-full sm:w-3/4 group">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by character name..."
                className="input input-bordered w-full bg-black/50 border-2 border-yellow-500/60 text-white placeholder:text-transparent focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/70 transition-all duration-300 shadow-inner shadow-yellow-500/20 outline-none peer"
              />
              {/* Animated Placeholder Label */}
              <label className="absolute left-3 -top-2.5 text-xs text-yellow-500/80 font-mono uppercase tracking-widest bg-black px-1 rounded opacity-0 group-focus-within:opacity-100 group-hover:opacity-70 transition-opacity pointer-events-none animate-pulse">
                Search by character name...
              </label>
            </div>

            {/* Search Button with Neon Glow */}
            <button
              type="submit"
              className="btn btn-primary btn-wide hover:bg-yellow-400 hover:text-black text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 shadow-yellow-400/50 border border-yellow-500/60 flex items-center gap-1 group relative overflow-hidden"
            >
              <span className="relative z-10">Search</span>
              {/* Lightsaber Glowing Edge Effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500 to-transparent h-0.5 bottom-0 left-0 transform translate-y-1/2 group-hover:h-1 transition-all duration-300"></span>
            </button>
          </form>

          {/* Neon Lightsaber Loading Spinner */}
          {loading && (
            <div className="flex flex-col items-center justify-center space-y-6 py-10 px-4">
              {/* Outer Glow Container */}
              <div className="relative w-16 h-16 md:w-24 md:h-24 animate-pulse">
                {/* Outer Glowing Ring */}
                <div className="absolute inset-0 rounded-full blur-md bg-gradient-to-r from-yellow-400 via-red-500 to-blue-500 opacity-70 animate-ping"></div>
                
                {/* Inner Multi-color Spinner */}
                <div className="relative rounded-full border-4 border-t-yellow-400 border-b-green-400 border-l-blue-500 border-r-red-500 w-full h-full animate-spin"></div>

                {/* Center Glow Core */}
                <div className="absolute inset-2 md:inset-3 rounded-full bg-white/30 backdrop-blur-sm shadow-lg shadow-white/50 animate-flicker"></div>
              </div>

              {/* Text with Neon Gradient */}
              <p className="text-xl md:text-2xl font-extrabold text-center max-w-xs md:max-w-sm">
                <span className="block bg-gradient-to-r from-yellow-300 via-white to-red-400 text-transparent bg-clip-text animate-gradient">
                  Loading Character Data
                </span>
                <span className="flex justify-center mt-2 space-x-1">
                  <span className="dot w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="dot w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></span>
                  <span className="dot w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></span>
                </span>
              </p>
            </div>
          )}

        {/* Error Message */}
        {error && (
          <p className="text-error text-center text-lg font-bold animate-shake">
            {error}
          </p>
        )}

        {/* Character Card */}
        {character && (
          <div className="card bg-gray-900 shadow-2xl shadow-yellow-500/40 border border-yellow-500/30 mb-10 transform transition-all duration-500 hover:shadow-yellow-500/70 hover:-translate-y-2 hover:scale-105 z-10">
            <div className="card-body p-7 rounded-xl bg-black/60 backdrop-blur-sm">
              <h2 className="card-title text-4xl text-yellow-400 text-center">{character.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <p><strong>Description:</strong> {character.description}</p>
                <p><strong>Gender:</strong> {character.gender}</p>
                <p><strong>Height:</strong> {character.height} cm</p>
                <p><strong>Mass:</strong> {character.mass} kg</p>
                <p><strong>Eye Color:</strong> {character.eye_color}</p>
                <p><strong>Skin Color:</strong> {character.skin_color}</p>
                <p><strong>Hair Color:</strong> {character.hair_color}</p>
                <p><strong>Birth Year:</strong> {character.birth_year}</p>
              </div>
            </div>
          </div>
        )}

        {/* Homeworld Card */}
        {homeworld && (
          <div className="card bg-gray-900 shadow-2xl shadow-blue-500/40 border border-blue-500/30 mb-10 transform transition-all duration-500 hover:shadow-blue-500/70 hover:-translate-y-2 hover:scale-105 z-10">
            <div className="card-body p-7 rounded-xl bg-black/60 backdrop-blur-sm">
              <h2 className="card-title text-3xl text-blue-400 text-center">🌍 Home World: {homeworld.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <p><strong>Climate:</strong> {homeworld.climate}</p>
                <p><strong>Diameter:</strong> {homeworld.diameter}</p>
                <p><strong>Population:</strong> {homeworld.population}</p>
                <p><strong>Gravity:</strong> {homeworld.gravity}</p>
                <p><strong>Terrain:</strong> {homeworld.terrain}</p>
                <p><strong>Surface Water:</strong> {homeworld.surface_water}</p>
                <p><strong>Orbital Period:</strong> {homeworld.orbital_period} days</p>
                <p><strong>Rotation Period:</strong> {homeworld.rotation_period} hours</p>
              </div>
            </div>
          </div>
        )}

        {/* Species Info Card */}
        {species && (
          <div className="card bg-gray-900 shadow-2xl shadow-green-500/40 border border-green-500/30 mb-10 transform transition-all duration-500 hover:shadow-green-500/70 hover:-translate-y-2 hover:scale-105 z-10">
            <div className="card-body p-7 rounded-xl bg-black/60 backdrop-blur-sm">
              <h2 className="card-title text-3xl text-green-400 text-center">🧬 Species / Race: {species.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <p><strong>Average Height:</strong> {species.average_height}</p>
                <p><strong>Average Lifespan:</strong> {species.average_lifespan}</p>
                <p><strong>Classification:</strong> {species.classification}</p>
                <p><strong>Designation:</strong> {species.designation}</p>
                <p><strong>Language:</strong> {species.language}</p>
                <p><strong>Skin Colors:</strong> {species.skin_colors}</p>
                <p><strong>Hair Colors:</strong> {species.hair_colors}</p>
                <p><strong>Eye Colors:</strong> {species.eye_colors}</p>
              </div>
            </div>
          </div>
        )}

        {/* Films Info Card */}
        {films.length > 0 && (
          <div className="mt-12 space-y-8">
            <h2 className="text-4xl font-bold text-center mb-8 text-purple-400">🎥 Appears In Films:</h2>
            {films.map((film) => (
              <div key={film.uid} className="card bg-gray-900 shadow-2xl shadow-purple-500/40 border border-purple-500/30 transform transition-all duration-500 hover:shadow-purple-500/70 hover:-translate-y-2 hover:scale-105 z-10">
                <div className="card-body p-7 rounded-xl bg-black/60 backdrop-blur-sm">
                  <h3 className="card-title text-2xl text-purple-300 text-center font-extrabold">{film.properties.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <p><strong>Episode:</strong> {film.properties.episode_id}</p>
                    <p><strong>Director:</strong> {film.properties.director}</p>
                    <p><strong>Producer:</strong> {film.properties.producer}</p>
                    <p><strong>Release Date:</strong> {film.properties.release_date}</p>
                    <p><strong>Description:</strong> {film.description}</p>
                  </div>
                  <details className="mt-4 group">
                    <summary className="cursor-pointer text-yellow-400 underline font-semibold group-open:text-yellow-300 transition-colors">
                      📜 Opening Crawl
                    </summary>
                    <pre className="whitespace-pre-wrap mt-2 p-4 bg-gray-800 rounded-box text-yellow-200 font-mono text-sm">
                      {film.properties.opening_crawl}
                    </pre>
                  </details>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </main>
);
}