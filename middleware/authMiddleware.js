const { verifyToken } = require("../utils/jwt");

function authMiddleware(req, res, next) {
  if (req.method === "OPTIONS") {
    return next();
  }

  const openRoutes = [
    { method: "POST", path: "/admin/login" },
    { method: "POST", path: "/admin/logout" },
    { method: "POST", path: "/user" },
  ];

  const isOpen = openRoutes.some(
    (route) => route.method === req.method && req.path === route.path
  );

  if (isOpen) {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    req.user = verifyToken(token);
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = authMiddleware;
