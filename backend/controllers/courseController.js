const { Course, Module, File, User, Enrollment } = require('../models');

const createCourse = async (req, res) => {
  const { name, description } = req.body;
  const instructorId = req.user.id;

  if (req?.user?.role !== 'instructor') {
    return res.status(403).json({error: 'Access denied'});
  }

  if (!name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }


  try {
    const course = await Course.create({ name, description, instructorId });
    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create course' });
    console.error('Error creating course:', error);
  }
};

const getInstructorCourses = async (req, res) => {
  const instructorId = req.user.id;

  if (req?.user?.role !== 'instructor') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const courses = await Course.findAll({ where: { instructorId } });
    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve courses' });
    console.error('Error retrieving courses:', error);
  }
};

const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const instructorId = req.user.id;

  if (req?.user?.role !== 'instructor') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const course = await Course.findOne({ where: { id, instructorId } });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    course.name = name || course.name;
    course.description = description || course.description;
    await course.save();
    res.status(200).json({ message: 'Course updated successfully', course });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update course' });
    console.error('Error updating course:', error);
  }
};

const deleteCourse = async (req, res) => {
  const { id } = req.params;
  const instructorId = req.user.id;

  if (req?.user?.role !== 'instructor') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const course = await Course.findOne({ where: { id, instructorId } });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    await course.destroy();
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete course' });
    console.error('Error deleting course:', error);
  }
};

const getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findOne({ where: { id }, include: [{ model: Module, include: [File] }] });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.status(200).json({ course });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve course' });
    console.error('Error retrieving course:', error);
  }
};

const addModuleToCourse = async (req, res) => {
  const { courseId, moduleName, description } = req.body;
  const instructorId = req.user.id;

  if (req?.user?.role !== 'instructor') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const course = await Course.findOne({ where: { id: courseId, instructorId } });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    const module = await course.createModule({ name: moduleName, description });
    res.status(201).json({ message: 'Module added successfully', module });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add module' });
    console.error('Error adding module:', error);
  }
};

const updateModuleInCourse = async (req, res) => {
  const { courseId, moduleId, moduleName, description } = req.body;
  const instructorId = req.user.id;

  if (req?.user?.role !== 'instructor') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const course = await Course.findOne({ where: { id: courseId, instructorId } });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const module = await Module.findOne({ 
      where: { 
        id: moduleId,
        courseId: courseId 
      }
    });

    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    await module.update({
      name: moduleName || module.name,
      description: description || module.description
    });

    res.status(200).json({ message: 'Module updated successfully', module });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update module' });
    console.error('Error updating module:', error);
  }
};

const deleteModuleFromCourse = async (req, res) => {
  const { courseId, moduleId } = req.body;
  const instructorId = req.user.id;

  if (req?.user?.role !== 'instructor') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const course = await Course.findOne({ where: { id: courseId, instructorId } });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const module = await Module.findOne({ 
      where: { 
        id: moduleId,
        courseId: courseId 
      }
    });

    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    await module.destroy();
    res.status(200).json({ message: 'Module deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete module' });
    console.error('Error deleting module:', error);
  }
};

const addFileToModule = async (req, res) => {
  const { moduleId, name } = req.body;

  if (!moduleId || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const file = await File.create({ moduleId, name });
    res.status(201).json({ message: 'File added successfully', file });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add file' });
    console.error('Error adding file:', error);
  }
};

const updateFileInModule = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const file = await File.findOne({ where: { id } });
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    file.name = name || file.name;
    await file.save();
    res.status(200).json({ message: 'File updated successfully', file });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update file' });
    console.error('Error updating file:', error);
  }
};

const deleteFileFromModule = async (req, res) => {
  const { id } = req.params;

  try {
    const file = await File.findOne({ where: { id } });
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    await file.destroy();
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete file' });
    console.error('Error deleting file:', error);
  }
};

const enrollStudentInCourse = async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user.id;

  if (req?.user?.role !== 'student') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const course = await Course.findOne({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    await Enrollment.create({ userId, courseId });
    res.status(200).json({ message: 'Enrolled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to enroll in course' });
    console.error('Error enrolling in course:', error);
  }
};

const addStudentToCourse = async (req, res) => {
  const { courseId, userId } = req.body;
  const instructorId = req.user.id;

  if (req?.user?.role !== 'instructor') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const course = await Course.findOne({ where: { id: courseId, instructorId } });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    await Enrollment.create({ userId, courseId });
    res.status(200).json({ message: 'Student added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add student to course' });
    console.error('Error adding student to course:', error);
  }
};

const removeStudentFromCourse = async (req, res) => {
  const { courseId, userId } = req.body;
  const instructorId = req.user.id;

  if (req?.user?.role !== 'instructor') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const course = await Course.findOne({ where: { id: courseId, instructorId } });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    await Enrollment.destroy({ where: { userId, courseId } });
    res.status(200).json({ message: 'Student removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove student from course' });
    console.error('Error removing student from course:', error);
  }
};

const unenrollFromCourse = async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user.id;

  if (req?.user?.role !== 'student') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const course = await Course.findOne({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    await Enrollment.destroy({ where: { userId, courseId } });
    res.status(200).json({ message: 'Unenrolled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unenroll from course' });
    console.error('Error unenrolling from course:', error);
  }
};

const getStudentEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const enrollments = await Enrollment.findAll({
      where: { userId },
      include: [{
        model: Course,
        include: [{
          model: User,
          as: 'instructor',
          attributes: ['id', 'fName', 'lName']
        }]
      }]
    });

    const courses = enrollments.map(enrollment => ({
      id: enrollment.Course.id,
      title: enrollment.Course.name,
      instructor: `${enrollment.Course.instructor.fName} ${enrollment.Course.instructor.lName}`
    }));

    res.json(courses);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ message: 'Error retrieving enrolled courses' });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve all courses' });
    console.error('Error retrieving all courses:', error);
  }
};

module.exports = {
  createCourse,
  getInstructorCourses,
  updateCourse,
  deleteCourse,
  getCourseById,
  addModuleToCourse,
  updateModuleInCourse,
  deleteModuleFromCourse,
  addFileToModule,
  updateFileInModule,
  deleteFileFromModule,
  enrollStudentInCourse,
  addStudentToCourse,
  removeStudentFromCourse,
  unenrollFromCourse,
  getStudentEnrolledCourses,
  getAllCourses
};