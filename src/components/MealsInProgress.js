import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom/';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import copy from 'clipboard-copy';
import Button from './Button';
import shareIcon from '../images/shareIcon.svg';
import BtnFavorite from './BtnFavorite';

function MealsInProgress() {
  const [meal, setMeal] = useState({});
  const history = useHistory();
  const { id } = useParams();
  const [ingredients, setIngredients] = useState([]);
  const [isbuttonDisabled, setIsbuttonDisabled] = useState(true);
  const [copyMessage, setCopyMessage] = useState('');

  const handleCopy = () => {
    const recipeLink = `http://localhost:3000/meals/${id}`;
    copy(recipeLink);
    console.log(recipeLink);
    setCopyMessage('Link copied!');
  };

  const getFoodInfo = async () => {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    const foodInfo = await fetch(url);
    const data = await foodInfo.json();
    const { meals } = data;
    setMeal(meals[0]);

    const ingredientAmount = 20;
    const ingredientsWithMeasure = [];
    for (let index = 1; index <= ingredientAmount; index += 1) {
      const currentIngredient = `strIngredient${index}`;
      const currentMeasure = `strMeasure${index}`;
      const ingredient = meals[0][currentIngredient];
      const measure = meals[0][currentMeasure];
      if (measure !== null && measure !== ''
        && ingredient !== null && ingredient !== '') {
        ingredientsWithMeasure.push({ name: `${ingredient} - ${measure}`,
          checked: false,
        });
      }
    }
    const storedProgress = JSON
      .parse(localStorage.getItem('inProgressRecipes')) || {};
    const storedIngredients = storedProgress.meals?.[id] || [];
    if (storedIngredients.length > 0) {
      setIngredients(storedIngredients);
    } else {
      setIngredients(ingredientsWithMeasure);
    }
  };

  useEffect(() => {
    getFoodInfo();
  }, []);

  // se todos tiverem checked a função retorna false
  const checkButtonDisabled = () => {
    let result = false;
    ingredients.forEach((ingredient) => {
      if (ingredient.checked === false) {
        result = true;
      }
    });
    setIsbuttonDisabled(result);
  };

  const handleIngredientChange = (index) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index].checked = !updatedIngredients[index].checked;
    setIngredients(updatedIngredients);

    checkButtonDisabled();

    const storedProgress = JSON.parse(localStorage.getItem('inProgressRecipes')) || {};
    const updatedProgress = {
      ...storedProgress,
      meals: {
        ...storedProgress.meals,
        [id]: updatedIngredients,
      },
    };
    localStorage.setItem('inProgressRecipes', JSON.stringify(updatedProgress));
  };

  const finishRecipe = () => {
    const doneRecipes = JSON.parse(localStorage.getItem('doneRecipes')) ?? [];

    const date = new Date();
    const obj = {
      id: meal.idMeal,
      nationality: meal.strArea,
      name: meal.strMeal,
      category: meal.strCategory,
      image: meal.strMealThumb,
      tags: meal.strTags.split(','),
      alcoholicOrNot: '',
      type: 'meal',
      doneDate: date.toISOString(),
    };
    localStorage.setItem('doneRecipes', JSON.stringify([...doneRecipes, obj]));
    history.push('/done-recipes');
  };

  return (
    <div className="tela-progress">
      <div>
        <img
          src={ meal.strMealThumb }
          data-testid="recipe-photo"
          alt={ meal.strMeal }
        />
        <h1 data-testid="recipe-title">{ meal.strMeal }</h1>
      </div>
      <Button
        onClick={ handleCopy }
        id="share-btn"
        text={ <img src={ shareIcon } alt="Share Button" /> }
      />
      <BtnFavorite
        id={ id }
        name={ meal.strMeal }
        image={ meal.strMealThumb }
        alcoholicOrNot=""
        type="meal"
        nationality={ meal.strArea }
        category={ meal.strCategory }

      />
      <p>{copyMessage}</p>

      <p data-testid="recipe-category">{ meal.strCategory}</p>
      {
        ingredients.map((ingredient, index) => (
          <ul key={ index }>
            <li>
              <label
                style={ ingredient.checked === true
                  ? { textDecoration: 'line-through solid rgb(0, 0, 0)' } : { } }
                data-testid={ `${index}-ingredient-step` }
              >
                <input
                  type="checkbox"
                  checked={ ingredient.checked }
                  onChange={ () => handleIngredientChange(index) }
                />
                { ingredient.name }
              </label>
            </li>
          </ul>
        ))
      }

      <div data-testid="instructions">
        <h2>Instruções</h2>
        <p>{ meal.strInstructions }</p>
      </div>

      <button
        data-testid="finish-recipe-btn"
        disabled={ isbuttonDisabled }
        onClick={ () => finishRecipe() }
      >
        Finalizar Receita

      </button>
    </div>
  );
}

export default MealsInProgress;
