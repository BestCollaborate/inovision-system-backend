const { default: lectureService } = require("../services/lecture.service");


exports.storeLecture = (req, res) => {
  console.log(req.body);
  lectureService.storeLecture(req.body)
    .then((result) => {
      res.status(200).json({ message: 'success' });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

exports.getLectures = (req, res) => {
  const { uid } = req.query;
  lectureService.getLectures(uid)
    .then((result) => {
      console.log(result)
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};
exports.validateLecture = (req, res) => {
  const { uid, lectureId, role } = req.params;
  const teacherId = (role === "student" ? req.query.teacherId : "")
  lectureService.validateLecture({ uid, lectureId, role, teacherId })
    .then((result) => {
      console.log(result)
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};
exports.getFreeLecture = (req, res) => {
  lectureService.getFreeLecture()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

exports.updateLecture = (req, res) => {
  const { uid } = req.params;
  console.log(uid);
  console.log(req.body);
  lectureService.updateLecture(uid, req.body)
    .then((result) => {
      res.status(200).json({ message: 'success' });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

exports.deleteLecture = (req, res) => {
  res.send('deleteLecture');
};