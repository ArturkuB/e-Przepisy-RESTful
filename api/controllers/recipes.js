import mongoose from 'mongoose';
import Recipe from '../models/recipe.js';
import Image from '../models/image.js'
import multer from 'multer';
import checkAuth from '../middleware/check-auth.js';
import path from 'path';

const recipes_get_image = async (req, res, next) => {
  try {
    const imageId = req.params.imageId;
    const image = await Image.findById(imageId);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Uzyskaj pełną bezwzględną ścieżkę do pliku
    const imagePath = path.join(process.cwd(), 'uploads', image.filename);

    // Ustaw nagłówek odpowiedzi na typ obrazu
    res.setHeader('Content-Type', 'image/*');
    
    // Wyślij sam obraz jako odpowiedź
    res.sendFile(imagePath);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};




const recipes_get_all = async (req, res, next) => {
  try {
    const docs = await Recipe.find().populate('recipeImage').exec();

    const response = {
      count: docs.length,
      recipes: docs.map((doc) => {
        return {
          _id: doc._id,
          author: doc.author,
          name: doc.name,
          cookingTime: doc.cookingTime,
          recipeImage: {
            _id: doc.recipeImage._id,
            url: `http://localhost:3000/images/${doc.recipeImage._id}`, // Dodaj URL obrazu
          },
          servings: doc.servings,
          ingredients: doc.ingredients,
          description: doc.description,
          instructions: doc.instructions,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/recipes/' + doc._id,
          },
        };
      }),
    };

    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


const recipes_create_recipe = [checkAuth, upload.single('recipeImage'), async (req, res, next) => {
  try {
    const image = new Image({
      _id: new mongoose.Types.ObjectId(),
      filename: req.file.filename,
    });

    const savedImage = await image.save();

    const recipe = new Recipe({
      _id: new mongoose.Types.ObjectId(),
      author: req.body.author,
      name: req.body.name,
      cookingTime: req.body.cookingTime,
      recipeImage: savedImage._id,
      servings: req.body.servings,
      ingredients: req.body.ingredients,
      description: req.body.description,
      instructions: req.body.instructions,
    });

    const savedRecipe = await recipe.save();

    res.status(201).json({
      message: 'Created recipe successfully',
      createdRecipe: {
        _id: savedRecipe._id,
        author: savedRecipe.author,
        name: savedRecipe.name,
        cookingTime: savedRecipe.cookingTime,
        recipeImage: savedRecipe.recipeImage,
        servings: savedRecipe.servings,
        ingredients: savedRecipe.ingredients,
        description: savedRecipe.description,
        instructions: savedRecipe.instructions,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/recipes/' + savedRecipe._id,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
}];



const recipes_get_recipe = async (req, res, next) => {
  try {
    const id = req.params.recipeId;
    const doc = await Recipe.findById(id).populate('recipeImage').exec();

    if (doc) {
      res.status(200).json({
        recipe: {
          _id: doc._id,
          author: doc.author,
          name: doc.name,
          cookingTime: doc.cookingTime,
          recipeImage: {
            _id: doc.recipeImage._id,
            filename: doc.recipeImage.filename,
          },
          servings: doc.servings,
          ingredients: doc.ingredients,
          description: doc.description,
          instructions: doc.instructions,
        },
        request: {
          type: 'GET',
          url: 'http://localhost:3000/recipes',
        },
      });
    } else {
      res.status(404).json({ message: 'No valid entry found for provided ID' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};


const recipes_update_recipe = (req, res, next) => {
  const id = req.params.recipeId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Recipe.updateOne({ _id: id }, { $set: updateOps }) // Używamy updateOne z modelu Recipe
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'Recipe updated',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/recipes/' + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

const recipes_delete = (req, res, next) => {
  const id = req.params.recipeId;
  Recipe.deleteOne({ _id: id }) // Używamy deleteOne z modelu Recipe
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'Recipe deleted',
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

export default {
  recipes_get_image,
  recipes_get_all,
  recipes_create_recipe,
  recipes_get_recipe,
  recipes_update_recipe,
  recipes_delete,
};
