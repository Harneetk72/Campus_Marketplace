  import { College } from "../Model/collegeSchema.js";
  export const createCollege = async function (req, res, next) {
    try {
      const { collegeName, address } = req.body;
      if (!collegeName || !address) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }
      const isadminExist = await College.findOne({ admin: req.user.id });
      if (isadminExist) {
        return res.status(400).json({
          message: "Admin can create only one college",
        });
      }

      const iscollegeExist = await College.findOne({ collegeName: collegeName });
      if (iscollegeExist) {
        return res.status(400).json({
          message: "college already Registered",
        });
      }
      const college = await College.create({
  collegeName,
  address,
  admin: req.user.id,
});

return res.status(201).json({
  message: "college created Successfully",
  college,
});
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };
  // get all college


  export const getColleges = async (req, res) => {
    try {
      const colleges = await College.find();

      res.status(200).json({
        colleges
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };