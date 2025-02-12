import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    let token = req.headers["authorization"];
    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, process.env.JWT_SECERET, (err, decoded) => {
        if (err) {
            console.log(err)
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.userId = decoded.userId;
        req.storeName = decoded.storeName;
        next();
    });
};

export default verifyToken;