const Recipe = require('../models/Recipe');
const { getParams } = require('../../lib/utils');
const api = require('../services/api').api;

module.exports = {
    async index(req, res) {
        try {
            const params = getParams(req.query, 6);
            const { data } = await api.get('/admin/recipes', params);

            res.render('admin/recipes/index', { 
                recipes: data.recipes,
                pagination: data.pagination
            });
        } catch (err) {
            console.error(err);
        }
    },
    async userRecipes(req, res) {
        try {
            const params = getParams(req.query, 6);            
            const {data} = await api.get('/admin/recipes/my-recipes', params);
            
            return res.render('admin/recipes/index', { 
                recipes: data.recipes,
                pagination: data.pagination
            });
        } catch (err) {
            console.error(err);
        }
    },
    async create(req, res) {
        try {
            const chefsOptions = await Recipe.chefsSelectOptions();
            return res.render('admin/recipes/create', { chefsOptions });
        } catch (err) {
            console.error(err);
        }
    },
    async post(req, res) {
        try {
            const { data } = await api.post('/admin/recipes', {
                chef_id: req.body.chef,
                title: req.body.title,
                ingredients: req.body.ingredients,
                preparation: req.body.preparation,
                information: req.body.information,
                files: req.files
            });

            return res.redirect(`/admin/recipes/${data.recipe_id}`);
        } catch (err) {
            console.error(err);
        }
    },
    async show(req, res) {
        try {
            const {data} = await api.get(`admin/recipes/${req.params.id}`);
            if (!data.recipe) return res.send('Receita não encontrada!');
            return res.render('admin/recipes/show', { recipe: data.recipe });
        } catch (err) {
            console.error(err);
        }
    },
    async edit(req, res) {
        try {
            const {data} = await api.get(`admin/recipes/${req.params.id}`);
            if (!data.recipe) return res.send('Receita não encontrada!');
            const chefsOptions = await Recipe.chefsSelectOptions();
            return res.render('admin/recipes/edit', { recipe: data.recipe, chefsOptions });
        } catch (err) {
            console.error(err);
        }
    },
    async put(req, res) {
        try {

            const { data } = await api.put('/admin/recipes', {
                id: req.body.id,
                removed_files: req.body.removed_files,
                chef_id: req.body.chef,
                title: req.body.title,
                ingredients: req.body.ingredients,
                preparation: req.body.preparation,
                information: req.body.information,
                files: req.files
            })

            return res.redirect(`/admin/recipes/${data.id}`);
        } catch (err) {
            console.error(err);
        }
    },
    async delete(req, res) {
        try {
            const {data} = await api.request({
                url: 'admin/recipes',
                method: 'delete',
                data: { id: req.body.id }
            });

            return res.redirect('/admin');
        } catch (err) {
            console.error(err);
        }
    }
};