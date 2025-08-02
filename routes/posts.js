const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts');

//GET
router.get('/', postsController.posts_get);
// router.get('/', postsController.posts_get_latest);
router.get('/:slug', postsController.posts_get_one);
router.get('/:id/comments', postsController.posts_get_comments);
router.get('/:id/comments/:commentId', postsController.posts_get_one_comment);

//POST
router.post('/:id/comments', postsController.posts_create_comment);
router.post('/', postsController.posts_create);

//PUT
router.put('/:slug', postsController.posts_update);
router.put('/:id/comments/:commentId', postsController.posts_update_comment);

//PATCH
router.patch('/:slug/publish', postsController.posts_toggle_publish);
// router.patch('/:id/comments/:commentId', postsController.posts_toggle_comment);

//DELETE
router.delete('/:id', postsController.posts_delete);
router.delete('/:id/comments/:commentId', postsController.posts_delete_comment);

module.exports = router;
