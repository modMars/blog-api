const express = require('express');
const router = express.Router();
const imagesController = require('../controllers/images');
const upload = require('../middleware/handleUpload');

//GET
router.get('/', imagesController.images_get);
// router.get('/', postsController.posts_get_latest);
router.get('/:id', imagesController.images_get_one);

//POST
router.post('/', upload.single('file'), imagesController.images_create);

//DELETE
router.delete('/:id', imagesController.images_delete);

module.exports = router;
