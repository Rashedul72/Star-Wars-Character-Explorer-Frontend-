Star Wars Character Explorer – Technical Documentation
Overview
Star Wars Character Explorer is a full-stack React-based web application that allows users to search for characters from the Star Wars universe. It fetches data from the SWAPI.tech API and displays detailed information including:
•	Character bio and stats
•	Homeworld
•	Species
•	Films where the character appears
The app emphasizes usability and theme with a responsive, animated interface styled to reflect the Star Wars aesthetic.
________________________________________
System Architecture
Frontend
•	Built with React using Next.js Client Components
•	Handles user input, state, UI rendering, and animations
•	Communicates directly with the Express backend and the public SWAPI.tech API
Backend
•	Lightweight Node.js + Express server
•	Provides a single endpoint to simplify character fetching:
o	GET /api/characters?search=<character_name>
•	Proxies requests to the SWAPI.tech /people endpoint to return clean character data to the frontend
________________________________________
 
Workflow Breakdown
1. Character Search
export const fetchCharacterByName = async (query) => {
  const searchUrl = `http://localhost:5000/api/characters?search=${query}`;

  const res = await axios.get(searchUrl);
  const result = res.data.result?.[0]; // First match

  if (result?.properties) {
    return {
      ...result.properties,
      description: result.description || "No description available",
    };
  } else {
    throw new Error("Character not found");
  }
};
•	The user types a character's name.
•	Frontend sends the query to the backend.
•	Backend hits https://www.swapi.tech/api/people?name=query.
•	The first match from the results is returned (no UID logic).
•	Character details include a homeworld field (as a URL), url (used later for species and films), and basic properties.
________________________________________
2. Fetching Homeworld
export const fetchHomeworld = async (homeworldUrl) => {
  const res = await axios.get(homeworldUrl);
  return res.data.result?.properties || {};
};
•	The homeworld field in the character object is a direct URL (e.g., https://www.swapi.tech/api/planets/1).
•	That URL is fetched directly to get homeworld details like name, climate, population, etc.
________________________________________
3.  Fetching Species (Matching by URL)
export const fetchSpeciesForCharacter = async (charUrl) => {
  const res = await axios.get("https://www.swapi.tech/api/species");
  const speciesList = res.data.results || [];

  for (const speciesItem of speciesList) {
    const speciesDetail = await axios.get(speciesItem.url);
    const speciesData = speciesDetail.data.result?.properties;

    if (speciesData.people?.includes(charUrl)) {
      return speciesData; // Match found
    }
  }
  return null;
};
•	Fetches all species from /api/species.
•	Iterates over each species and checks if the people field (an array of character URLs) includes the character’s URL.
•	If matched, that species is returned.
•	This avoids relying on uid and uses URL inclusion logic.
________________________________________
4. Fetching Films (Matching by URL)
export const fetchFilmsForCharacter = async (charUrl) => {
  const res = await axios.get("https://www.swapi.tech/api/films");
  const allFilms = res.data.result || [ ];

  return allFilms.filter((film) => film.properties?.characters?.includes(charUrl));
};
•	Fetches all films from /api/films.
•	Filters only the films whose characters array contains the character’s URL.
•	This shows all movies that the character appears in using the same URL-based matching logic.
________________________________________
Component Responsibilities
CharacterSearch.js
•	Main UI logic
•	Handles:
o	Search input
o	API requests to fetch character, homeworld, species, and films
o	State management
o	Conditional rendering of animated cards
starWarsService.js
•	Contains all async API logic, decoupled from UI:
o	fetchCharacterByName(query)
o	fetchHomeworld(url)
o	fetchSpeciesForCharacter(charUrl)
o	fetchFilmsForCharacter(charUrl)
________________________________________
 
Data Flow Diagram (High-Level)
User Input ──▶ /api/characters?search=Luke Skywalker
                 │
                 ▼
       Backend calls SWAPI people?name=...
                 	│
                 	▼
     Character Info + URL fields returned
                 	          │
        ┌────────┴────────┐
        ▼                			 ▼
 fetchHomeworld()   fetchSpecies() → matches char URL in species.people[]
        │                 │
        ▼                 ▼
   Planet Info         Species Info
                             │
                             ▼
                     fetchFilms() → matches char URL in film.characters[]
                             │
                             ▼
                        Films List
________________________________________
 
Technologies Used
Layer	Technology
Frontend	React (Next.js)
Backend	Node.js + Express
Styling	Tailwind CSS + DaisyUI
Data Source	SWAPI.tech

API Client	Axios
________________________________________
Key Features
•	Search characters by name
•	View rich profile data, homeworld, species, and films
•	Animated, Star Wars-themed interface
•	URL-based matching for species and film data (no UID dependency)
•	Full responsiveness and mobile-friendly layout
•	Graceful error handling and loading states

Conclusion
The Star Wars Character Explorer project demonstrates a modular, scalable approach to consuming and presenting external API data using modern web technologies. By leveraging the SWAPI.tech API, the application offers rich, interconnected Star Wars universe data — including character, homeworld, species, and film information. Built with a clean separation of concerns, the project utilizes Node.js and Express for backend proxying, React with Next.js for dynamic UI rendering, and Tailwind CSS with Daisy UI for a responsive and visually engaging user experience. Through efficient API handling with Axios and structured component logic, the system provides a seamless, interactive search experience. The design choices prioritize maintainability, clarity, and extensibility — ensuring the application is both robust and developer-friendly.
