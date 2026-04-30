const Group = require("../models/Group");

// Create a new group
const createGroup = async (req, res) => {
  try {
    const newGroup = await Group.create(req.body);
    res.json(newGroup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all groups (with member names populated)
const getAllGroups = async (req, res) => {
  try {
    const allGroups = await Group.find().populate("members", "name");
    res.json(allGroups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createGroup, getAllGroups };