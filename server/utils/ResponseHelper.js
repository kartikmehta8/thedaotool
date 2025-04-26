class ResponseHelper {
  static success(res, message, data = {}) {
    return res.status(200).json({ success: true, message, ...data });
  }

  static created(res, message, data = {}) {
    return res.status(201).json({ success: true, message, ...data });
  }

  static error(res, message, statusCode = 500) {
    return res.status(statusCode).json({ success: false, message });
  }
}

module.exports = ResponseHelper;
