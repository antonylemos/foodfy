const { unlinkSync } = require('fs');

const Recipe = require('../models/Recipe');
const File = require('../models/File');
const RecipeFile = require('../models/RecipeFile');
const loadRecipeService = require('../services/LoadRecipeService');
const { getParams } = require('../../lib/utils');

module.exports = {
    async index(req, res) {
        try {
            const params = getParams(req.query, 6);
            const recipes = await loadRecipeService.load('recipes', params);
            const pagination = { page: params.page };

            recipes.length == 0
            ? pagination.total = 1
            : pagination.total = Math.ceil(recipes[0].total / params.limit);
            
            return res.json({ recipes, pagination});
        } catch (err) {
            console.error(err);
        }
    },
    async userRecipes(req, res) {
        try {
            const params = getParams(req.query, 6);
            //params.id = req.session.userId;
            
            const recipes = await loadRecipeService.load('recipes', params);
            const pagination = { page: params.page };

            recipes.length == 0
            ? pagination.total = 1
            : pagination.total = Math.ceil(recipes[0].total / params.limit);
            
            return res.json({ recipes, pagination });
        } catch (err) {
            console.error(err);
        }
    },
    async post(req, res) {
        try {
            const { chef_id, title, ingredients,
                preparation, information } = req.body;

            const recipe_id = await Recipe.create({
                chef_id,
                //user_id: req.session.userId,
                user_id: 3,
                title,
                ingredients,
                preparation,
                information
            });

            const filesPromise = req.body.files.map(async file => {
                const file_id = await File.create({
                    name: file.filename,
                    path: file.path
                });
                await RecipeFile.create({
                    file_id,
                    recipe_id
                });
            });

            await Promise.all(filesPromise);

            return res.json({recipe_id});
        } catch (err) {
            console.error(err);
        }
    },
    async show(req, res) {
        try {
            const recipe = await loadRecipeService.load('recipe', req.params.id);
            if (!recipe) return res.json({error: 'Receita não encontrada!'});
            return res.json({recipe});
        } catch (err) {
            console.error(err);
        }
    },
    async put(req, res) {
        try {
            let { id, removed_files, chef_id, title, ingredients,
                preparation, information } = req.body;

            if (req.body.files.length != 0) {
                const newFilesPromise = req.body.files.map(async file => {
                    const file_id = await File.create({
                        name: file.filename,
                        path: file.path
                    });
                    await RecipeFile.create({
                        file_id,
                        recipe_id: id
                    });
                });

                await Promise.all(newFilesPromise);
            }

            if (removed_files) {
                removed_files = removed_files.split(',');
                const lastIndex = removed_files.length - 1;
                removed_files.splice(lastIndex, 1);

                const removedFilesPromise = removed_files.map(async id => {
                    RecipeFile.delete({ file_id: id });
                    
                    const file = await File.findOne({ where: { id } });
                    File.delete({ id });
                    if (file.path != 'public/images/recipe_placeholder.png') {
                        unlinkSync(file.path);
                    }
                });

                await Promise.all(removedFilesPromise);
            }

            await Recipe.update(id, {
                chef_id,
                title,
                ingredients,
                preparation,
                information
            });

            return res.json({id});
        } catch (err) {
            console.error(err);
        }
    },
    async delete(req, res) {
        try {
            const files = await Recipe.files(req.body.id);
            const deletedFilesPromise = files.map(file => {
                File.delete({ id: file.file_id });
                if (file.path != 'public/images/recipe_placeholder.png') {
                    unlinkSync(file.path);
                }
            });

            await Promise.all(deletedFilesPromise);
            await Recipe.delete({ id: req.body.id });
            //req.session.success = 'Receita excluída com sucesso!';

            return res.json();
        } catch (err) {
            console.error(err);
        }
    }
};