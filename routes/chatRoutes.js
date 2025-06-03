
const express = require('express');
const router = express.Router();
const Message = require('../model/Message'); // From your previous model.js

// Mock MongoDB collection (replace with actual MongoDB model)
const mongoose = require('mongoose');
const chatSchema = new mongoose.Schema({
  room: String,
  messages: [
    {
      id: String,
      user: String,
      content: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
});
const Chat = mongoose.model('Chat', chatSchema, 'chats');

// POST /api/chat/room - Create a new chat room
router.post('/room', async (req, res) => {
  try {
    const { room } = req.body;
    if (!room) {
      return res.status(400).json({ error: 'Room name is required' });
    }
    let chat = await Chat.findOne({ room });
    if (chat) {
      return res.status(400).json({ error: 'Room already exists' });
    }
    chat = new Chat({ room, messages: [] });
    await chat.save();
    res.status(201).json({ message: `Room ${room} created`, room });
  } catch (error) {
    console.error(`Error creating room: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/chat/room/:room - Get message history for a room
router.get('/room/:room', async (req, res) => {
  try {
    const { room } = req.params;
    const chat = await Chat.findOne({ room });
    if (!chat) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.status(200).json({ room, messages: chat.messages });
  } catch (error) {
    console.error(`Error fetching messages: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/chat/message - Add a message to a room (for HTTP fallback or persistence)
router.post('/message', async (req, res) => {
  try {
    const { room, user, content } = req.body;
    if (!room || !user || !content) {
      return res.status(400).json({ error: 'Room, user, and content are required' });
    }
    const message = new Message('http-' + Date.now(), user, content);
    let chat = await Chat.findOne({ room });
    if (!chat) {
      chat = new Chat({ room, messages: [message] });
    } else {
      chat.messages.push(message);
    }
    await chat.save();
    res.status(201).json({ message: 'Message added', data: message });
  } catch (error) {
    console.error(`Error adding message: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
