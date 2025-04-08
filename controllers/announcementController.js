const Announcement = require('../models/Announcement');
const { sendTelegramNotification } = require('../services/telegramService');

exports.getUserAnnouncements = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const announcements = await Announcement.find({
      isActive: true,
      $or: [
        { 'recipients.userId': userId },
        { recipients: { $size: 0 } } // Broadcast announcements
      ],
      endDate: { $gt: new Date() }
    }).sort('-createdAt');
    
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { announcementId } = req.params;
    const userId = req.user._id;
    
    await Announcement.updateOne(
      { _id: announcementId, 'recipients.userId': userId },
      { $set: { 'recipients.$.read': true, 'recipients.$.readAt': new Date() } }
    );

    // Send Telegram notification
    const announcement = await Announcement.findById(announcementId);
    if (announcement) {
      const message = `Announcement marked as read: ${announcement.title}`;
      await sendTelegramNotification(message);
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};