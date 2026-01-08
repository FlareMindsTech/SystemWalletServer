import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../Modules/UserModule.js';
import { sendUserMail } from '../SendMail/sendUserMail.js';

const saltRounds = 10;

const generateReferenceID = async () => {
    const prefix = "ARRA";
    let ReferenceID;
    let exists = true;

    while (exists) {
        const randomNumber = Math.floor(100000 + Math.random() * 900000);
        ReferenceID = `${prefix}${randomNumber}`;
        
        const user = await User.findOne({ ReferenceID: ReferenceID });
        exists = !!user;
    }
    return ReferenceID;
};


const generatePassword = (userName, mobileNo) => {
    const namePart = userName.replace(/\s+/g, "").substring(0, 4).toLowerCase();
    const mobilePart = mobileNo.toString().slice(-4);
    return `${namePart}${mobilePart}`;
};

export const Register = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "Request body is missing or empty" });
        }

        const { userName, email, mobileNo, PanCardno, AadharCardNo, Role, balance } = req.body;

        
        let panCardFrontImage = req.body.panCardFrontImage;
        let panCardBackImage = req.body.panCardBackImage;
        let aadharCardFrontImage = req.body.aadharCardFrontImage;
        let aadharCardBackImage = req.body.aadharCardBackImage;

        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                if (file.fieldname === "panCardFrontImage") panCardFrontImage = file.originalname;
                if (file.fieldname === "panCardBackImage") panCardBackImage = file.originalname;
                if (file.fieldname === "aadharCardFrontImage") aadharCardFrontImage = file.originalname;
                if (file.fieldname === "aadharCardBackImage") aadharCardBackImage = file.originalname;
            });
        }

        
        const exUser = await User.findOne({ $or: [{ email }, { mobileNo }] });
        if (exUser) {
            return res.status(400).json({ message: "Email or Mobile already exists" });
        }

        const ReferenceID = await generateReferenceID();
        const plainPassword = generatePassword(userName, mobileNo);
        const hash = await bcrypt.hash(plainPassword, saltRounds);

        const register = new User({
            userName,
            ReferenceID, 
            email,
            mobileNo,
            password: hash,
            PanCardno,
            AadharCardNo,
            Role: Role || "User",
            balance: balance || 0,
            panCardFrontImage,
            panCardBackImage,
            aadharCardFrontImage,
            aadharCardBackImage
        });

        const user = await register.save();

       
        try {
            await sendUserMail(email, userName, mobileNo, plainPassword, ReferenceID);
        } catch (mailError) {
            console.error("Email failed but user created:", mailError.message);
        }

        res.status(201).json({
            message: "User created successfully",
            ReferenceID,
            password: plainPassword,
            id: user._id
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const foundUser = await User.findOne({ email });

        if (!foundUser) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign(
            { id: foundUser._id, role: foundUser.Role, email: foundUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
  try {
    if (req.user.role !== 'Admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Access denied. You can only update your own profile." });
    }

    const updateData = { ...req.body };

    
    if (!updateData.password && (updateData.userName || updateData.mobileNo)) {
      const currentUser = await User.findById(req.params.id);
      if (currentUser) {
        const finalName = updateData.userName || currentUser.userName;
        const finalMobile = updateData.mobileNo || currentUser.mobileNo;
        const newDefaultPassword = generatePassword(finalName, finalMobile);
        updateData.password = await bcrypt.hash(newDefaultPassword, 10);
      }
    } else if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const userData = user.toObject();
    userData.defaultPassword = generatePassword(user.userName, user.mobileNo);

    res.status(200).json({
      message: "Updated successfully",
      data: userData
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  let email = req.body.email;
  try {
    const userToDelete = await User.findOne({ email: email });
    if (!userToDelete) return res.status(404).json({ message: 'User not found' });

    if (req.user.role !== 'Admin' && req.user.id !== userToDelete._id.toString()) {
      return res.status(403).json({ message: "Access denied. You can only delete your own account." });
    }

    await User.findOneAndDelete({ email: email });
    res.status(200).json({ message: "User deleted success" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const profile = async (req, res) => {
  try {
    const view = await User.findById({ _id: req.user.id }).select("-password");
    if (!view) return res.status(404).json({ message: "User not found" });

    const userData = view.toObject();
    userData.defaultPassword = generatePassword(view.userName, view.mobileNo);

    res.status(200).json({ data: userData });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const getAllUser = async (req, res) => {
    try {
        const getUsers = await User.find().select("-password");
        const usersWithDefaults = getUsers.map(user => {
            const u = user.toObject();
            u.defaultPassword = generatePassword(user.userName, user.mobileNo);
            return u;
        });
        res.status(200).json({ data: usersWithDefaults });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const getUserById = async (req, res) => {
  try {
    const view = await User.findById({ _id: req.params.id }).select("-password");
    if (!view) return res.status(404).json({ message: "User not found" });

    const userData = view.toObject();
    userData.defaultPassword = generatePassword(view.userName, view.mobileNo);

    res.status(200).json({ data: userData });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
