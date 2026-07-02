const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// IMPORTANT: /eligible must be defined BEFORE /:id
// otherwise Express will treat "eligible" as an :id param
router.get('/eligible', studentController.getEligibleStudents);

router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);
router.post('/', studentController.createStudent);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
