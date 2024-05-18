const express = require("express");
const Album = require("../models/album");
const auth = require("../middleware/auth");
const Group = require("../models/group");

const router = new express.Router();

// router.post("/", auth(["client", "admin", "assistant"]), async (req, res) => {
router.post("/", auth("client"), async (req, res) => {
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

router.post("/photos", auth("client"), async (req, res) => {
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

router.get("/", auth("client"), async (req, res) => {
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

router.get("/photos", auth("client"), async (req, res) => {
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


module.exports = router;