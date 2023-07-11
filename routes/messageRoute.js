
let router=require('express').Router();

let {allowedTo,ptotected}=require('../services/authService');

let {getChatMessages,deleteMessage,updateMessage,resizeImage,
    createMessage,allowToDeleteAndUpdate}=require('../services/messageService');

let {updateMessageValidator,deleteMessageValidator,
    getMessagesValidator,createMessageValidator}=require('../validators/messageValidator');

let {uploadSingleImage,uploadMultipleImages}=require('../middlewares/uploadImage')
router.use(ptotected,allowedTo('user','admin'));
router.route('/').post(uploadSingleImage('Image'),resizeImage,createMessageValidator,createMessage);

router.route('/:chatId').get(getMessagesValidator,getChatMessages);

router.route('/:id').delete(deleteMessageValidator,allowToDeleteAndUpdate,deleteMessage)
    .put(updateMessageValidator,allowToDeleteAndUpdate,updateMessage);

            

module.exports = router;