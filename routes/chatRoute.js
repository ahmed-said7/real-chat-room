let router=require('express').Router();

let {allowedTo,ptotected}=require('../services/authService');

let {createChat,deleteChat,getChats,getChat}=require('../services/chatService');

let {deleteChatValidator,
    getChatValidator,createChatValidator}=require('../validators/chatValidator')

router.route('/').post(ptotected,allowedTo('admin','user'),createChatValidator,createChat)
.get(ptotected,allowedTo('admin','user'),getChats);

router.route('/:id').delete(ptotected,allowedTo('admin','user'),deleteChatValidator,deleteChat);
router.route('/:userId').get(ptotected,allowedTo('admin','user'),getChatValidator,getChat);
            

module.exports = router;