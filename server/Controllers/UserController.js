import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"


//get all users

export const getAllUsers = async (req, res) => {
    try {
        let users = await UserModel.find();
        users = users.map((user)=>{
            const { password, ...otherDetails } = user._doc;
            return otherDetails
        })
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get a user

export const getUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await UserModel.findById(id);
        if (user) {
            const { password, ...otherDetails } = user._doc;
            res.status(200).json(otherDetails);
        } else {
            res.status(404).json("User not found");
        }
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// update a user

export const updateUser = async (req, res) => {
    const id = req.params.id; // The user ID from URL parameters
    const {_id, currentUserAdminStatus, password } = req.body;

    // Assuming `req.user.id` is the authenticated user's ID from the token
    if (id === _id) {
        try {
            // Hash the new password if it is being updated
            if (password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password, salt);
            }

            // Update user and return the new user data
            const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true });

            // Generate a new token with updated user information
            const token = jwt.sign(
                { username: user.username, id: user._id },
                process.env.JWT_KEY,
                { expiresIn: "1h" }
            );
            res.status(200).json({ user, token });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(403).json("Access Denied");
    }
};



// Delete a user

export const deleteUser = async (req, res) => {
    const id = req.params.id;
    const { currentUserId, currentUserAdminStatus } = req.body;

    if (id === currentUserId || currentUserAdminStatus) {    
        try {
            await UserModel.findByIdAndDelete(id);
            res.status(200).json("User has been deleted");
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(403).json("Access Denied");
    }
}

// Follow a user

export const followUser = async (req, res) => {
    const id = req.params.id;
    const { _id } = req.body;

    if (_id === id) {
        res.status(403).json("Action forbidden");
    } else {
        try {   
            const followUser = await UserModel.findById(id);
            const followingUser = await UserModel.findById(_id);

            if (!followUser.followers.includes(_id)) {
                await followUser.updateOne({ $push: { followers: _id } });
                await followingUser.updateOne({ $push: { following: id } });
    
                res.status(200).json("Followed user");
            } else {
                res.status(403).json("Already following");
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

}

//Unfollow a user

export const UnFollowUser = async (req, res) => {
    const id = req.params.id;
    const { _id } = req.body;

    if (_id === id) {
        res.status(403).json("Action forbidden");
    } else {
        try {   
            const followUser = await UserModel.findById(id);
            const followingUser = await UserModel.findById(_id);

            if (followUser.followers.includes(_id)) {
                await followUser.updateOne({ $pull: { followers: _id } });
                await followingUser.updateOne({ $pull: { following: id } });

                res.status(200).json("Unfollowed user");
            } else {
                res.status(403).json("Not following");
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

}