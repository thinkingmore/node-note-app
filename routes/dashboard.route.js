const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/checkAuth');
const dashboardController = require('../controllers/dashboard.controller');

/**
 * Dashboard Routes 
*/
router.get('/dashboard', isLoggedIn, dashboardController.dashboard);
router.get('/dashboard/note/:id', isLoggedIn, dashboardController.dashboardViewNote);
router.put('/dashboard/note/:id', isLoggedIn, dashboardController.dashboardUpdateNote);
router.delete('/dashboard/note/:id', isLoggedIn, dashboardController.dashboardDeleteNote);
router.get('/dashboard/add', isLoggedIn, dashboardController.dashboardAddNote);
router.post('/dashboard/add', isLoggedIn, dashboardController.dashboardAddNoteSubmit);
router.get('/dashboard/search', isLoggedIn, dashboardController.dashboardSearch);
router.post('/dashboard/search', isLoggedIn, dashboardController.dashboardSearchSubmit);


module.exports = router;