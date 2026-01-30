exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};

exports.isOrganizer = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "organizer" || req.user.role === "admin")
  ) {
    next();
  } else {
    res.status(403).json({ message: "Organizer access only" });
  }
};