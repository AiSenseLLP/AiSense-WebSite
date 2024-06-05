const successResponse = (res, message) => {
  return res.status(200).json({ alert: "alert-success", message });
};

const errorResponse = (res, message) => {
  return res.status(500).json({ alert: "alert-danger", message });
};

module.exports = { successResponse, errorResponse };
