const loadChefService = require('../services/LoadChefService');
const { getParams } = require('../../lib/utils');
const api = require('../services/api').api;

module.exports = {
    async index(req, res) {
        try {
            const params = getParams(req.query, 12);
            const { data } = await api.get('/admin/chefs', params);

            return res.render('admin/chefs/index', {
                 chefs: data.chefs, 
                 pagination: data.pagination 
            });
        } catch (err) {
            console.error(err);
        }
    },
    create(req, res) {
        return res.render('admin/chefs/create');
    },
    async post(req, res) {
        try {
            const { data } = await api.post('/admin/chefs', {
                name: req.body.name,
                files: req.files
            });

            return res.redirect(`/admin/chefs/${data.chefId}`);
        } catch (err) {
            console.error(err);
        }
    },
    async show(req, res) {
        try {
            const { data } = await api.get(`admin/chefs/${req.params.id}`);
            if (!data.chef) return res.send('Chef não encontrado!');
            return res.render('admin/chefs/show', { chef: data.chef });
        } catch (err) {
            console.error(err);
        }
    },
    async edit(req, res) {
        try {
            const chef = await loadChefService.load('chef', req.params.id);
            if (!chef) return res.send('Chef não encontrado!');
            return res.render('admin/chefs/edit', { chef });
        } catch (err) {
            console.error(err);
        }
    },
    async put(req, res) {
        try {
            const { data } = await api.put('/admin/chefs', {
                id: req.body.id,
                name: req.body.name,
                file_id: req.body.file_id, 
                removed_files: req.body.removed_files,
                files: req.files
            });

            return res.redirect(`/admin/chefs/${data.id}`);
        } catch (err) {
            console.error(err);
        }
    },
    async delete(req, res) {
        try {
            const {data} = await api.request({
                url: 'admin/chefs',
                method: 'delete',
                data: { 
                    id: req.body.id,
                    file_id: req.body.file_id
                }
            });

            return res.redirect('/admin/chefs');
        } catch (err) {
            console.error(err);
        }
    }
};