const homeService = require('../services/apis').homeService;
const { getParams } = require('../../lib/utils');

module.exports = {
    async index(req, res) {
        try {
            const { data } = await homeService.get('/');
            return res.render('main/index', { recipes: data.recipes });
        } catch (err) {
            console.error(err);
        }
    },
    about(req, res) {
        return res.render('main/about');
    },
    async recipes(req, res) {
        try {
            const params = getParams(req.query, 6);

            const { data } = await homeService.get('/recipes', {
                params: {
                    page: params.page,
                },
            });

            if (params.search) return res.render('main/search-result', {
                recipes: data.recipes,
                search: params.search,
                pagination: data.pagination,
            });

            return res.render('main/recipes', { recipes: data.recipes, pagination: data.pagination });
        } catch (err) {
            console.error(err);
        }
    },
    async showRecipe(req, res) {
        try {
            const { data } = await homeService.get(`/recipes/${req.params.id}`);
            if (!data.recipe) return res.send('Receita não encontrada!');
            return res.render('main/recipe-page', { recipe: data.recipe });
        } catch (err) {
            console.error(err);
        }
    },
    async chefs(req, res) {
        try {
            const params = getParams(req.query, 12);

            const { data } = await homeService.get('/chefs', {
                params: {
                    page: params.page,
                },
            });

            return res.render('main/chefs', { chefs: data.chefs, pagination: data.pagination });
        } catch (err) {
            console.error(err);
        }
    },
    async showChef(req, res) {
        try {
            const { data } = await homeService.get(`/chefs/${req.params.id}`);
            if (!data.chef) res.send('Chef não encontrado!');
            return res.render('main/chef-profile', { chef: data.chef });
        } catch (err) {
            console.error(err);
        }
    }
};