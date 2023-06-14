import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import shareIcon from '../images/shareIcon.svg';
import BtnFavorite from './BtnFavorite';

function DrinksInProgress() {
  const [drink, setDrink] = useState({});
  const history = useHistory();
  const { id } = useParams();
  const [ingredients, setIngredients] = useState([]);
  const [isbuttonDisabled, setIsbuttonDisabled] = useState(true);

  useEffect(() => {
    const url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;
    const getFoodInfo = async () => {
      try {
        const foodInfo = await fetch(url);
        const data = await foodInfo.json();
        const { drinks } = data;

        setDrink(drinks[0]);
        const ingredientAmount = 15;
        const ingredientsWithMeasure = [];
        for (let index = 1; index <= ingredientAmount; index += 1) {
          const currentIngredient = `strIngredient${index}`;
          const currentMeasure = `strMeasure${index}`;
          const ingredient = drinks[0][currentIngredient];
          const measure = drinks[0][currentMeasure];
          if (measure !== null && measure !== ''
            && ingredient !== null && ingredient !== '') {
            ingredientsWithMeasure.push({ name: `${ingredient} - ${measure}`,
              checked: false,
            });
          }
        }
        setIngredients(ingredientsWithMeasure);
      } catch (error) {
        console.log(error);
      }
    };
    getFoodInfo();
  }, []);

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
  };

  const finishRecipe = () => {
    const doneRecipes = JSON.parse(localStorage.getItem('doneRecipes')) ?? [];

    const date = new Date();
    const obj = {
      id: drink.idDrink,
      nationality: '',
      name: drink.strDrink,
      category: drink.strCategory,
      image: drink.strDrinkThumb,
      tags: [],
      alcoholicOrNot: drink.strAlcoholic,
      type: 'drink',
      doneDate: date.toISOString(),
    };
    localStorage.setItem('doneRecipes', JSON.stringify([...doneRecipes, obj]));
    history.push('/done-recipes');
  };

  return (
    <div>
      <div>
        <img
          src={ drink.strDrinkThumb }
          data-testid="recipe-photo"
          alt={ drink.strDrink }
        />
        <h1 data-testid="recipe-title">{ drink.strDrink}</h1>
        <p data-testid="recipe-category">{ drink.strCategory}</p>
        <p>{ drink.strAlcoholic}</p>
      </div>

      <button data-testid="share-btn">
        <img src={ shareIcon } alt="compartilhar" />
      </button>
      <BtnFavorite
        id={ id }
        name={ drink.strDrink }
        image={ drink.strDrinkThumb }
        nationality=""
        alcoholicOrNot={ drink.strAlcoholic }
        type="drink"
        category={ drink.strCategory }
      />

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
        <p>{ drink.strInstructions}</p>
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

export default DrinksInProgress;
