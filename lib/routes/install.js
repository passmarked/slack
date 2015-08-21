
export default async function install(req, res) {
  const token = req.query.token;
  res.send(`you sent a token: ${token}`);
};
