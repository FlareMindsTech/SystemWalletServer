import jwt from "jsonwebtoken";

export const Authentication = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // attach token payload
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};


export const Authorization = (req, res, next) => {
  try {
    // Static admin check
    if (!req.user || req.user.type !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admin access only"
      });
    }

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Access denied"
    });
  }
};
