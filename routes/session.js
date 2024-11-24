const express = require('express');
const router = express.Router();
const sessionCtrl = require('../controllers/session');

router.get('/', sessionCtrl.getAllSessions);
router.get('/planifiee', sessionCtrl.getSessionPlanifiee);
router.get('/nextsession', sessionCtrl.getNextPlannedSession);
router.get('/activesession', sessionCtrl.isSessionActive);
router.get('/encours', sessionCtrl.getSessionEnCours);
router.put('/update', sessionCtrl.updateSessionStatus);
router.post('/', sessionCtrl.createSession);
router.delete('/:id', sessionCtrl.deleteSession);

module.exports = router;