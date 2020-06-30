import React from 'react';
import logo from './logo.svg';
import './App.css';
import NavBar from "./components/NavBar"
import 'bootstrap/dist/css/bootstrap.min.css';
import JumboCarousel from './components/JumboCarousel'
import carouselBooks from './data/carousel.json'
import Releases from './components/Releases'


function App() {
  return (
    <>
    
    <NavBar/>
    <JumboCarousel books = {carouselBooks}/> 
    <Releases/>
    
    </>
  );
}

export default App;
