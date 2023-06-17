import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';

function BtnFavorite({ id, type, nationality, category, alcoholicOrNot, name, image }) {
  const [isFavorite, setIsFavorite] = useState(false);

  function toggleFavorite() {
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    if (favoriteRecipes.some((recipe) => +recipe.id === +id)) {
      localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes
        .filter((recip) => +recip.id !== +id)));
      setIsFavorite(false);
    } else {
      setIsFavorite(true);
      localStorage.setItem('favoriteRecipes', JSON.stringify([...favoriteRecipes, {
        id,
        type,
        nationality,
        category,
        alcoholicOrNot,
        name,
        image,
      }]));
    }
  }

  useEffect(() => {
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    if (favoriteRecipes.some((recipe) => +recipe.id === +id)) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
  }, [id]);
  return (
    <button
      onClick={ toggleFavorite }
    >
      <img
        src={ isFavorite ? blackHeartIcon : whiteHeartIcon }
        alt="botão favoritar"
        data-testid="favorite-btn"
      />
    </button>
  );
}
BtnFavorite.propTypes = {
  id: PropTypes.element.isRequired,
  type: PropTypes.element.isRequired,
  nationality: PropTypes.element.isRequired,
  category: PropTypes.element.isRequired,
  alcoholicOrNot: PropTypes.element.isRequired,
  name: PropTypes.element.isRequired,
  image: PropTypes.element.isRequired,
};
export default BtnFavorite;
