import express from 'express';
import checkAuth from '../middleware/check-auth.js';
import RecipesController from '../controllers/recipes.js';

const router = express.Router();


router.get('/', RecipesController.recipes_get_all);

router.post('/', RecipesController.recipes_create_recipe);

router.get('/images/:imageId', RecipesController.recipes_get_image);

router.get('/:recipeId', RecipesController.recipes_get_recipe);

router.patch('/:recipeId', checkAuth, RecipesController.recipes_update_recipe);

router.delete('/:recipeId', checkAuth, RecipesController.recipes_delete);

export default router;
