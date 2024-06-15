const express = require("express");
const Album = require("../models/album");
const auth = require("../middleware/auth");
const Group = require("../models/group");
const mongoose = require('mongoose')

const router = new express.Router();

/**
 * For now access given all roles to create a group
 * Evalute this and check if only client can have this acess
 */
router.post("/", auth(["client", "admin", "assistant"]), async (req, res) => {
    const { groupName, albumId } = req.body;
    const group = new Group({
        groupName,
        album: albumId,
        client: req.user,
    });

    try {
        const album = await Album.findById(albumId);
        if (!album) {
            return res
                .status(400)
                .send({ message: "Album does not exists" });
        }
        await group.save();
        albumUpdate = await Album.findByIdAndUpdate(
            { _id: req.body.albumId },
            { $push: { groups: group._id } }
        );
        if (!albumUpdate) {
            return res.status(400).send({ message: "Creating group failed" });
        }
        res.status(201).send({ id: group.id, name: group.groupName });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

/**
 * For now access given all roles to add photos to a group
 * Evalute this and check if only client can have this acess
 */
router.post("/photos", auth(["client", "admin", "assistant"]), async (req, res) => {
    const { groupId, photoIds } = req.body;
    try {
        const group = await Group.findByIdAndUpdate(
            groupId,
            {
                $addToSet: {
                    photos: {
                        $each: photoIds
                    }
                }
            }
        );
        if (!group) {
            return res
                .status(400)
                .send({ message: "Group does not exists" });
        }
        res.status(200).send({ success: true });
    } catch (e) {
        res.status(400).send(e.message);
    }
});

router.get("/", auth(["client", "admin", "assistant"]), async (req, res) => {
    try {
        const album = await Album.findById(req.query.albumId).populate({
            path: "groups",
            select: "_id groupName",
        });
        if (!album) {
            return res.status(400).send({ message: "Unable to find album" });
        }
        res.send(album.groups);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

router.get("/photos", auth(["client", "admin", "assistant"]), async (req, res) => {
    try {
        const group = await Group.findById(req.query.id);
        if (!group) {
            return res
                .status(400)
                .send({ status: false, message: "Group not found" });
        }
        await group.populate({
            path: "photos",
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
            },
        });

        photos = group.photos.map(photoObj => {
            photoObj.path = `http://localhost:8080/images/${photoObj.path}`
            return photoObj
        });
        res.send(photos);
    } catch (e) {
        res.status(500).send({ message: "error in getting group photos" });
    }
});


// For transactions look for 
// https://stackoverflow.com/questions/51461952/mongodb-v4-0-transaction-mongoerror-transaction-numbers-are-only-allowed-on-a
// https://thecodebarbarian.com/introducing-run-rs-zero-config-mongodb-runner
// router.delete("/", auth("client"), async (req, res) => {
//     const groupId = req.query.id.toString().trim();

//     const session = await mongoose.startSession();
//     session.startTransaction();
//     try {
//         group = await Group.findById(groupId);
//         await Album.findByIdAndUpdate(group.album._id,
//             {
//                 $pullAll: {
//                     groups: groupId,
//                     //to remove multiple groups try
//                     // groups: [groupId1,groupId2,groupId3]
//                 },
//             },
//             { session })
//         await Group.findByIdAndDelete(groupId, null, { session });
//         await session.commitTransaction();
//     } catch (error) {
//         await session.abortTransaction();
//         console.log(error)
//         return res.status(500).send({ message: "error in deleting group" });
//     } finally {
//         session.endSession();
//     }
//     res.status(200).json({ success: true });
// });

router.delete("/", auth(["client", "admin", "assistant"]), async (req, res) => {
    const groupId = req.query.id.toString().trim();

    try {
        group = await Group.findById(groupId);
        if (!group) {
            return res.status(400).send({ message: "Group not found" });
        }
        await Album.findByIdAndUpdate(group.album._id,
            {
                $pull: {
                    groups: groupId
                },
                //to remove multiple groups try
                // $pullAll: {
                //     groups: [groupId1,groupId2,groupId3]
                // },
            })
        await Group.findByIdAndDelete(groupId);
    } catch (error) {
        return res.status(500).send({ message: "error in deleting group" });
    }
    res.status(200).json({ success: true });
});

module.exports = router;