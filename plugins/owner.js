const { cmd } = require("../command");
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');

cmd({
  pattern: "getbio",
  desc: "Displays the user's bio.",
  category: "owner",
  filename: __filename,
}, async (conn, mek, m, { args, reply }) => {
  try {
    const jid = args[0] ? (args[0].includes('@') ? args[0] : `${args[0]}@s.whatsapp.net`) : mek.key.remoteJid;
    const about = await conn.fetchStatus?.(jid);
    if (!about) return reply("⚠️ No bio found.");
    reply(`💬 User Bio:\n\n${about.status}`);
  } catch (error) {
    console.error("Error in getbio command:", error);
    reply("❌ No bio found.");
  }
});



cmd({
  pattern: "setonline",
  desc: "Update Online Privacy",
  category: "owner",
  react: "🔐",
  filename: __filename
}, async (conn, mek, m, { isOwner, args, reply }) => {
  if (!isOwner) return reply("❌ You are not the owner!");
  try {
    const value = args[0] || 'all';
    const validValues = ['all', 'match_last_seen'];
    if (!validValues.includes(value)) return reply("❌ Invalid option. Valid: all, match_last_seen.");
    await conn.updateOnlinePrivacy(value);
    reply(`✅ Online privacy updated to: ${value}`);
  } catch (e) {
    reply(`❌ Error: ${e.message}`);
  }
});

cmd({
  pattern: "setmyname",
  desc: "Set your WhatsApp display name.",
  category: "owner",
  react: "⚙️",
  filename: __filename
}, async (conn, mek, m, { isOwner, args, reply }) => {
  if (!isOwner) return reply("❌ You are not the owner!");
  const displayName = args.join(" ");
  if (!displayName) return reply("❌ Please provide a display name.");
  try {
    const { state, saveCreds } = await useMultiFileAuthState('auth');
    const sock = makeWASocket({ auth: state, printQRInTerminal: true });
    sock.ev.on('creds.update', saveCreds);
    await sock.updateProfileName(displayName);
    reply(`✅ Display name set to: ${displayName}`);
  } catch (e) {
    console.error(e);
    reply("❌ Failed to set display name.");
  }
});

cmd({
  pattern: "updatebio",
  react: "🥏",
  desc: "Change the Bot number Bio.",
  category: "owner",
  use: '.updatebio <text>',
  filename: __filename
}, async (conn, mek, m, { isOwner, q, reply }) => {
  if (!isOwner) return reply("❌ Only owners can use this command!");
  if (!q) return reply("❌ Enter the new bio.");
  if (q.length > 139) return reply("❗ Character limit exceeded.");
  try {
    await conn.updateProfileStatus(q);
    reply("✔️ New bio added successfully!");
  } catch (e) {
    reply(`❌ Error: ${e.message}`);
  }
});

cmd({
  pattern: "groupsprivacy",
  desc: "Update Group Add Privacy",
  category: "owner",
  react: "🔐",
  filename: __filename
}, async (conn, mek, m, { isOwner, args, reply }) => {
  if (!isOwner) return reply("❌ You are not the owner!");
  try {
    const value = args[0] || 'all';
    const validValues = ['all', 'contacts', 'contact_blacklist', 'none'];
    if (!validValues.includes(value)) return reply("❌ Invalid option. Valid: all, contacts, contact_blacklist, none.");
    await conn.updateGroupsAddPrivacy(value);
    reply(`✅ Group add privacy updated to: ${value}`);
  } catch (e) {
    reply(`❌ Error: ${e.message}`);
  }
});

cmd({
  pattern: "getprivacy",
  desc: "Get bot privacy settings",
  category: "owner",
  filename: __filename
}, async (conn, mek, m, { isOwner, reply }) => {
  if (!isOwner) return reply("❌ Only owners can use this command!");
  try {
    const privacy = await conn.fetchPrivacySettings?.(true);
    if (!privacy) return reply("❌ Failed to fetch privacy settings.");
    const msg = `
╭───「 𝙿𝚁𝙸𝚅𝙰𝙲𝚈 」───
│ ∘ Read Receipts: ${privacy.readreceipts}
│ ∘ Profile Picture: ${privacy.profile}
│ ∘ Status: ${privacy.status}
│ ∘ Online: ${privacy.online}
│ ∘ Last Seen: ${privacy.last}
│ ∘ Group Privacy: ${privacy.groupadd}
│ ∘ Call Privacy: ${privacy.calladd}
╰───────────────────`;
    reply(msg);
  } catch (e) {
    reply(`❌ Error: ${e.message}`);
  }
});

