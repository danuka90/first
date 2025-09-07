async function isAdmin(jid, user, conn) {
  const metadata = await conn.groupMetadata(jid);
  const participant = metadata.participants.find(p => p.id === user);
  return participant?.admin !== null && participant?.admin !== undefined;
}

async function isBotAdmin(jid, botId, conn) {
  const metadata = await conn.groupMetadata(jid);
  const participant = metadata.participants.find(p => p.id === botId);
  return participant?.admin !== null && participant?.admin !== undefined;
}

module.exports = {
  isAdmin,
  isBotAdmin
};
