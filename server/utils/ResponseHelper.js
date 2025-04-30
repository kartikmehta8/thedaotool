class ResponseHelper {
  static success(res, message, data = {}) {
    return res.status(200).json({ success: true, message, ...data });
  }

  static created(res, message, data = {}) {
    return res.status(201).json({ success: true, message, ...data });
  }

  static badRequest(res, message = 'Bad request') {
    return res.status(400).json({ success: false, message });
  }

  static unauthorized(res, message = 'Unauthorized') {
    return res.status(401).json({ success: false, message });
  }

  static forbidden(res, message = 'Forbidden') {
    return res.status(403).json({ success: false, message });
  }

  static notFound(res, message = 'Not found') {
    return res.status(404).json({ success: false, message });
  }

  static conflict(res, message = 'Conflict') {
    return res.status(409).json({ success: false, message });
  }

  static error(res, message = 'Internal server error') {
    return res.status(500).json({ success: false, message });
  }
}

module.exports = ResponseHelper;
