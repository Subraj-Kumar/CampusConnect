const cron = require("node-cron");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const cloudinary = require("../config/cloudinary");

const startCleanupJob = () => {
  console.log("🕒 [CRON] Background service started... standing by!"); 

  // 🕒 PRODUCTION SCHEDULE: Runs every day at 3:00 AM
  cron.schedule("0 3 * * *", async () => {
    console.log("🧹 [CRON] Wake up call: Checking for old events...");

    try {
      const cutoffDate = new Date();
      
      // 🕒 PRODUCTION CUTOFF: 30 days ago
      cutoffDate.setDate(cutoffDate.getDate() - 30); 

      console.log(`🔍 [CRON] Cutoff Time: ${cutoffDate.toISOString()}`);

      // 🚀 Fetch ALL events and filter them in JavaScript
      // This bypasses any MongoDB String vs Date type-mismatch errors
      const allEvents = await Event.find({});
      
      const oldEvents = allEvents.filter(event => {
        // JavaScript seamlessly handles both Strings and Date objects
        const eventDate = new Date(event.date); 
        return eventDate < cutoffDate;
      });

      if (oldEvents.length === 0) {
        console.log("✅ [CRON] Database is clean. No expired events found.");
        return;
      }

      console.log(`🗑️ [CRON] Found ${oldEvents.length} expired events! Purging now...`);

      for (let event of oldEvents) {
        // 1. Cloudinary Poster Cleanup
        if (event.poster) {
          try {
            const publicId = event.poster.split("/").slice(-1)[0].split(".")[0];
            await cloudinary.uploader.destroy(`campusconnect_events/${publicId}`);
            console.log(`🖼️ Deleted Cloudinary image for: ${event.title}`);
          } catch (err) { 
            console.log(`⚠️ Cloudinary error for ${event.title}:`, err.message); 
          }
        }

        // 2. Registrations Cleanup
        await Registration.deleteMany({ event: event._id });
        
        // 3. Event Cleanup
        await event.deleteOne();
        console.log(`✨ Deleted: ${event.title} from Database`);
      }
      
      console.log("🎉 [CRON] Daily cleanup cycle completed successfully!");
      
    } catch (error) {
      console.error("❌ [CRON] Job failed:", error.message);
    }
  });
};

module.exports = startCleanupJob;