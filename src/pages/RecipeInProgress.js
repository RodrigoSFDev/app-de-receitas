import React from 'react';
import { useLocation } from 'react-router-dom/cjs/react-router-dom';
import DrinksInProgress from '../components/DrinksInProgress';
import MealsInProgress from '../components/MealsInProgress';
import './inProgress.css';

function RecipeInProgress() {
  const { pathname } = useLocation();
  console.log(pathname);
  return (
    <div>
      {pathname.includes('/meals') ? <MealsInProgress /> : <DrinksInProgress />}
    </div>
  );
}

export default RecipeInProgress;
