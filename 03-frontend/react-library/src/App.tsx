import React from 'react';
import './App.css';
import { HomePage } from './layouts/HomePage/HomePage';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { SearchWorkoutsPage } from './layouts/SearchWorkoutsPage/SearchWorkoutsPage';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ActiveWorkoutPage } from './layouts/ActiveWorkoutPage.tsx/ActiveWorkoutPage';

export const App = () => {
  return (
    <div className='d-flex flex-column min-vh-100'>
      <Navbar />
      <div className='flex-grow-1'>
        <Switch>
          <Route path='/' exact>
            <Redirect to='/home' />
          </Route>
          <Route path='/home'>
            <HomePage />
          </Route>
          <Route path='/search'>
            <SearchWorkoutsPage />
          </Route>
          <Route path='/Active/:WorkoutId'>
            <ActiveWorkoutPage />
          </Route>
        </Switch>
      </div>
      <Footer />
    </div>
  );
}


