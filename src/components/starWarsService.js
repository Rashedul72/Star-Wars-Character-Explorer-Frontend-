import axios from "axios";


export const fetchCharacterByName = async (query) => {
  const searchUrl = `http://localhost:5000/api/characters?search=${query}`;

  try {
    const res = await axios.get(searchUrl);
    const result = res.data.result?.[0];

    if (result?.properties) {
      return {
        ...result.properties,
        description: result.description || "No description available",
      };
    } else {
      throw new Error("Character not found");
    }
  } catch (error) {
    // Only show friendly error, no logs
    throw new Error("Character not found");
  }
};


// Fetch homeworld details
export const fetchHomeworld = async (homeworldUrl) => {
  const res = await axios.get(homeworldUrl);
  const planetData = res.data.result?.properties || {};

  console.log("Parsed Homeworld Data:", planetData);
  return planetData;
};

// Fetch species that match the character
export const fetchSpeciesForCharacter = async (charUrl) => {
  const res = await axios.get("https://www.swapi.tech/api/species");
  const speciesList = res.data.results || [];

  for (const speciesItem of speciesList) {
    const speciesDetail = await axios.get(speciesItem.url);
    const speciesData = speciesDetail.data.result?.properties;

    if (speciesData.people?.includes(charUrl)) {
      console.log(`✅ Match found for species: ${speciesItem.name}`);
      return speciesData;
    }
  }

  return null;
};

// Fetch films the character appears in
export const fetchFilmsForCharacter = async (charUrl) => {
  const res = await axios.get("https://www.swapi.tech/api/films");
  const allFilms = res.data.result || [];

  return allFilms.filter((film) => film.properties?.characters?.includes(charUrl));
};
