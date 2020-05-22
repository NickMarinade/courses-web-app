const controllers = require('./controllers.js');
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ api: 'courses!' });
});
// write your routes
router.get('/db', controllers.getCourses);
router.post('/db', controllers.postCourse);
router.put('/db/:id', controllers.updCourse);
router.delete('/db/:id', controllers.deleteCourse);


module.exports = router;
