import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FixedSizeList as List } from 'react-window';
import './App.css';

const App = () => {
  const [breeds, setBreeds] = useState([]);
  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [dogImages, setDogImages] = useState([]);

  useEffect(() => {
    const fetchBreeds = async () => {
      const response = await axios.get('https://api.thedogapi.com/v1/breeds');
      setBreeds(response.data.map(breed => ({
        id: breed.id,
        name: breed.name,
        description: breed.temperament
      })));
    };
    fetchBreeds();
  }, []);

  useEffect(() => {
    const fetchBreedImages = async (breedId) => {
      const response = await axios.get(`https://api.thedogapi.com/v1/images/search?breed_id=${breedId}&limit=10`);
      return response.data.map(img => ({ url: img.url, breedId }));
    };

    const loadImages = async () => {
      const images = await Promise.all(selectedBreeds.map(breedId => fetchBreedImages(breedId)));
      setDogImages(images.flat());
    };

    if (selectedBreeds.length > 0) {
      loadImages();
    } else {
      setDogImages([]);
    }
  }, [selectedBreeds]);

  const handleSelectBreed = (breedId) => {
    setSelectedBreeds(prev => prev.includes(breedId) ? prev.filter(b => b !== breedId) : [...prev, breedId]);
  };

  const Row = ({ index, style }) => (
    <div style={style} className="filter-item">
      <label>
        <input
          type="checkbox"
          checked={selectedBreeds.includes(breeds[index].id)}
          onChange={() => handleSelectBreed(breeds[index].id)}
        />
        {breeds[index].name}
      </label>
    </div>
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>Dog Breed Gallery</h1>
      </header>
      <div className="sidebar">
        <h2>Filter</h2>
        <div style={{ height: 300, overflow: 'auto' }}>
          <List
            height={300}
            width={250}
            itemSize={50}
            itemCount={breeds.length}
          >
            {Row}
          </List>
        </div>
      </div>
      <div className="gallery">
        {dogImages.map((image, index) => (
          <div key={index}>
            <img src={image.url} alt={`Dog breed`} style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
            <p>{breeds.find(b => b.id === image.breedId)?.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;