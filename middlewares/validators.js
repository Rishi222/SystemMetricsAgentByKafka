const { validationResult } = require("express-validator");           

exports.validate = (req, res, next) => {

  // middleware to validate request body using express-validator. Central place to define input validation rules using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });
  next();

};
