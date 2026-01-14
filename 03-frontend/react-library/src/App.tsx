import React from 'react';
import './App.css';
import { HomePage } from './layouts/HomePage/HomePage';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { SearchWorkoutsPage } from './layouts/SearchWorkoutsPage/SearchWorkoutsPage';

export const App = () => {
  return (
    <div>
      <Navbar />
      {/* <HomePage /> */}
      <SearchWorkoutsPage />
      <Footer />
    </div>
  );
}


