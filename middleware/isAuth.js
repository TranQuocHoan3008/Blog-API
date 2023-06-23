const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    let decodedToken = null;
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) {
      const error = new Error("not authentication");
      error.statusCode = 401;
      throw error;
    }
    jwt.verify(token, "quochoantran3008", (error, data) => {
      decodedToken = data;
    });
    if (!decodedToken) {
      const error = new Error("not authentication");
      error.statusCode = 401;
      return res
        .status(500)
        .json({ message: "error authentication", errors: error });
    }
    req.userId = decodedToken.userId;
  } catch (error) {
    error.statusCode = 500;
    return res
      .status(500)
      .json({ message: "error authentication", errors: error });
  }

  next();
};
