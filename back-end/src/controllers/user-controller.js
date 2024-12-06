const userModal = require("../models/user-model");
const verifyModal = require("../models/verify-model");
const resetModal = require("../models/reset-model");
const friendModal = require("../models/friend-model");
const { compareString, hashString } = require("../utils/handle-string");
const createToken = require("../utils/handle-token");
const { sendResetPassword } = require("../utils/handle-email");

const userController = {
  //view status page
  viewStatus: (req, res) => {
    res.render("status");
  },

  //view reset page
  viewResetPage: (req, res) => {
    res.render("reset");
  },

  // verify account
  verifyEmail: async (req, res) => {
    const { userId, token } = req.params;

    try {
      // query to check is there any verify request
      const emailRecord = await verifyModal.findOne({ userId });
      if (!emailRecord) {
        const message = "No verification found";
        return res.redirect(`/user/verify?status=error&message=${message}`);
      }

      // query to check is token expired or not
      const { expiredAt, token: hashedToken } = emailRecord;
      if (expiredAt < Date.now()) {
        // query to delete user if token expired
        await userModal.findOneAndDelete({ _id: userId });

        // query to delete verify request if token expired
        await verifyModal.findOneAndDelete({ userId });
        const message = "Token has expired";
        res.redirect(`/user/verify?status=error&message=${message}`);
      }

      // compare token from URL with the token from database
      const isMatch = await compareString(token, hashedToken);

      if (isMatch) {
        // query to update verify status
        await userModal.findOneAndUpdate({ _id: userId }, { verified: true });

        // query to delete handled verify request
        await verifyModal.findOneAndDelete({ userId });

        const message = "Email Verified Success";
        res.redirect(`/user/verify?status=success&message=${message}`);
      } else {
        const message = "Invalid verify link";
        res.redirect(`/user/verify?status=error&message=${message}`);
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },

  // send-reset-password-link
  sendResetLink: async (req, res) => {
    const { email } = req.body;

    try {
      // query to check is account exits or not
      const userRecord = await userModal.findOne({ email });

      if (!userRecord) {
        return res.status(404).json({
          status: false,
          message: "Email not found, please try again",
        });
      }

      // send reset-password request
      await sendResetPassword(userRecord, res);
      return res.status(201).json({
        status: true,
        message: "Reset password link has been sent",
      });
    } catch (error) {
      return res.status(404).json({
        status: false,
        message: error.message,
      });
    }
  },

  // handle reset-password-link
  handleResetLink: async (req, res) => {
    const { userId, token } = req.params;

    try {
      // query to check is there any request or not
      const userRecord = await userModal.findById(userId);
      if (!userRecord) {
        const message = "No reset request found";
        return res.redirect(
          `/user/reset-status?status=error&message=${message}`
        );
      }

      const resetRecord = await resetModal.findOne({ userId });
      if (!resetRecord) {
        const message = "No reset request found";
        return res.redirect(
          `/user/reset-status?status=error&message=${message}`
        );
      }

      // check token is expired or not
      const { expiredAt, token: hashedToken } = resetRecord;
      if (expiredAt < Date.now()) {
        const message = "Reset password link has expired";
        return res.redirect(
          `/user/reset-status?status=error&message=${message}`
        );
      }

      // check token is match or not
      const isMatch = await compareString(token, hashedToken);
      if (isMatch) {
        return res.redirect(`/user/reset-password?type=reset&id=${userId}`);
      } else {
        const message = "Invalid reset link";
        return res.redirect(
          `/user/reset-status?status=error&message=${message}`
        );
      }
    } catch (error) {
      console.log(error);
      return res.status(404).json({
        status: false,
        message: error.message,
      });
    }
  },

  // handle change-password
  changePassword: async (req, res) => {
    const { userId, password } = req.body;
    console.log(userId);

    try {
      const hashedPassword = await hashString(password);
      const updateUser = await userModal.findByIdAndUpdate(
        { _id: userId },
        { password: hashedPassword }
      );

      if (updateUser) {
        // query to delete handled request
        await resetModal.findOneAndDelete(userId);
        return res.status(200).json({
          status: true,
          message: "Password change successfully",
        });
      }
    } catch (error) {
      return res.status(404).json({
        status: false,
        message: error.message,
      });
    }
  },

  // handle get all user profile
  getUser: async (req, res) => {
    const { userId } = req.body.user;
    const { id } = req.params;

    try {
      // query to check user exits or not
      const userRecord = await userModal.findById(id ?? userId).populate({
        path: "friends",
        select: "-password",
      });

      if (!userRecord) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }
      return res.status(200).json({
        status: true,
        user: userRecord,
      });
    } catch (error) {
      return res.status(404).json({
        status: false,
        message: error.message,
      });
    }
  },

  // handle update user profile
  updateUser: async (req, res) => {
    const { userId } = req.body.user;
    const { firstName, lastName, profession, location, avatar } = req.body;

    try {
      const updateUser = {
        _id: userId,
        firstName,
        lastName,
        location,
        avatar,
        profession,
      };

      // query to update new user
      const userRecord = await userModal
        .findByIdAndUpdate(userId, updateUser, {
          new: true,
        })
        .populate({ path: "friends", select: "-password" });

      const token = createToken(userRecord._id);
      return res.status(200).json({
        status: true,
        message: "User is updated",
        userRecord,
        token,
      });
    } catch (error) {
      return res.status(404).json({
        status: false,
        message: error.message,
      });
    }
  },

  // handle sent friend request
  sendFriendRequest: async (req, res) => {
    try {
      const { userId } = req.body.user;
      const { request_receiver } = req.body;

      // query to check is user has send or not
      const isSent = await friendModal.findOne({
        request_from: userId,
        request_receiver,
      });

      // query to check is user has recive or not
      const isReciver = await friendModal.findOne({
        request_from: request_receiver,
        request_receiver: userId,
      });

      if (isSent || isReciver) {
        return res.status(400).json({
          status: false,
          message: "Friend requst has been sent",
        });
      } else {
        // query to create a new friend request
        await friendModal.create({
          request_receiver,
          request_from: userId,
        });
        return res.status(201).json({
          status: true,
          message: "Friend request sent succesfully",
          receiver: request_receiver,
        });
      }
    } catch (error) {
      return res.status(404).json({
        status: false,
        message: error.message,
      });
    }
  },

  // handle get friend request
  getFriendRequest: async (req, res) => {
    const { userId } = req.body.user;
    try {
      // query to get all request of reciver with max is 10
      const filterRequest = await friendModal
        .find({
          request_receiver: userId,
          request_status: "pending..",
        })
        .populate({
          path: "request_from",
          select: "firstName lastName avatar location profession -password ",
        })
        .limit(10)
        .sort({
          _id: -1,
        });

      if (filterRequest) {
        return res.status(200).json({
          status: true,
          requests: filterRequest,
        });
      }
    } catch (error) {
      return res.status(404).json({
        status: false,
        message: error.message,
      });
    }
  },

  // handle request accpeted
  acceptRequest: async (req, res) => {
    const { userId } = req.body.user;
    const { request_id, request_status } = req.body;

    try {
      // query to check is request exits or not
      const isRequestExist = await friendModal.findById(request_id);
      if (!isRequestExist) {
        return res.status(400).json({
          status: false,
          message: "No friend request found",
        });
      }

      // query to update request_status
      const newRequest = await friendModal.findByIdAndUpdate(
        {
          _id: request_id,
          request_status: request_status,
        },
        { new: true }
      );

      if (request_status === "Accepted") {
        const userRecord = await userModal.findById(userId);
        userRecord.friends.push(newRequest.request_from);
        await userRecord.save();

        const friendRecord = await userModal.findById(newRequest.request_from);
        friendRecord.friends.push(newRequest.request_receiver);
        await friendRecord.save();

        // query to delete handled request
        await friendModal.findByIdAndDelete(request_id);
      } else if (request_status === "Denied") {
        await friendModal.findByIdAndDelete(request_id);
      }

      return res.status(201).json({
        status: true,
        message: "Friend request " + request_status,
      });
    } catch (error) {
      return res.status(404).json({
        status: false,
        message: error.message,
      });
    }
  },

  // handle viewer who watch profile
  viewProfile: async (req, res) => {
    try {
      const { userId } = req.body.user;
      const { id } = req.body;

      const userRecord = await userModal.findById(id);
      userRecord.views.push(userId);
      await userRecord.save();

      if (userRecord) {
        return res.status(201).json({
          status: true,
          message: "You have viewed profile" + userId,
        });
      }
    } catch (error) {
      return res.status(404).json({
        status: false,
        message: error.message,
      });
    }
  },

  // handle friend suggestion
  suggestFriend: async (req, res) => {
    try {
      const { userId } = req.body.user;

      // get recvie or sent request
      const sentFriendRequests = await friendModal
        .find({ request_from: userId })
        .select("request_receiver")
        .lean();

      const receivedFriendRequests = await friendModal
        .find({ request_receiver: userId })
        .select("request_from")
        .lean();

      // Chuyển đổi danh sách ID thành một mảng các ID cần loại trừ
      const excludeIds = [
        userId,
        ...sentFriendRequests.map((fr) => fr.request_receiver),
        ...receivedFriendRequests.map((fr) => fr.request_from),
      ];

      // create query object
      let queryObject = {
        _id: { $nin: excludeIds },
        friends: { $nin: userId },
      };

      // query to get 15 user include personal information.
      let queryResults = userModal
        .find(queryObject)
        .limit(15)
        .select("firstName lastName avatar location profession -password");

      const suggestedFriends = await queryResults;
      if (suggestedFriends.length === 0) {
        return res.status(200).json({ status: true, friends: [] });
      } else {
        return res.status(200).json({
          status: true,
          friends: suggestedFriends,
        });
      }
    } catch (error) {
      return res.status(404).json({
        status: false,
        message: error.message,
      });
    }
  },
};

module.exports = { userController };
