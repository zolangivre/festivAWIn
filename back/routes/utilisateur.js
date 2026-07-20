const express = require('express');
const router = express.Router();
const usersCtrl = require('../controllers/utilisateur');

router.get('/', usersCtrl.getAllUsers);
router.get('/vendeurs', usersCtrl.getAllSellers);
router.get('/acheteurs', usersCtrl.getAllBuyers);
router.get('/:id', usersCtrl.getUserById);
router.post('/', usersCtrl.createUser);
router.put('/:id', usersCtrl.updateUser);
router.delete('/:id', usersCtrl.deleteUser);

module.exports = router;