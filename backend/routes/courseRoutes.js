const express = require('express');
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create course route
router.post('/create', authMiddleware, courseController.createCourse);

// Retrieve courses for an instructor
router.get('/instructor', authMiddleware, courseController.getInstructorCourses);

// Update course route
router.put('/update/:id', authMiddleware, courseController.updateCourse);

// Delete course route
router.delete('/delete/:id', authMiddleware, courseController.deleteCourse);

// Add a module to a course
router.post('/module/add', authMiddleware, courseController.addModuleToCourse);

// Update a module in a course
router.put('/module/update', authMiddleware, courseController.updateModuleInCourse);

// Delete a module from a course
router.delete('/module/delete', authMiddleware, courseController.deleteModuleFromCourse);

// Add a file to a module
router.post('/module/file/add', authMiddleware, courseController.addFileToModule);

// Update a file in a module
router.put('/module/file/update/:id', authMiddleware, courseController.updateFileInModule);

// Delete a file from a module
router.delete('/module/file/delete/:id', authMiddleware, courseController.deleteFileFromModule);

// Enroll a student in a course
router.post('/enroll', authMiddleware, courseController.enrollStudentInCourse);

// Add a student to a course
router.post('/course/student/add', authMiddleware, courseController.addStudentToCourse);

// Remove a student from a course
router.delete('/course/student/remove', authMiddleware, courseController.removeStudentFromCourse);

// Unenroll a student from a course
router.delete('/course/student/unenroll', authMiddleware, courseController.unenrollFromCourse);

// Retrieve courses a student is enrolled in
router.get('/student/enrolled', authMiddleware, courseController.getStudentEnrolledCourses);

// Retrieve all courses
router.get('/all', courseController.getAllCourses);

// Retrieve a course by ID
router.get('/:id', authMiddleware, courseController.getCourseById);

module.exports = router;