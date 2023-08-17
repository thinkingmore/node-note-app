const mongoose = require('mongoose');
const Note = require('../models/Notes'); // Make sure you import your Note model

/**
 * GET /
 * Dashboard
 */

exports.dashboard = async (req, res) => {
  let perPage = 12;
  let page = req.query.page || 1;
  const locals = {
    title: 'Dashboard',
    description: 'Free NodeJS Notes App.',
  };


  try {
    const notes = await Note.aggregate([
      { $match: { user: new  mongoose.Types.ObjectId(req.user.id) } },
      { $sort: { updatedAt: -1 } },
      {
        $project: {
          title: { $substr: ['$title', 0, 30] },
          body: { $substr: ['$body', 0, 100] },
        },
      },
    ])
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();

    const count = await Note.countDocuments({
      user: new mongoose.Types.ObjectId(req.user.id),
    });

    res.render('dashboard/index', {
      user: req.user,
      locals,
      notes,
      layout: '../views/pages/layout',
      current: page,
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
};

/**
 * GET /
 * View Specific Note
 */

exports.dashboardViewNote = async (req, res) => {
  const note = await Note.findById({ _id: req.params.id })
    .where({ user: req.user.id })
    .lean();

  if (note) {
    res.render("dashboard/view-note", {
      user: req.user,
      noteID: req.params.id,
      note,
      layout: "../views/layouts/layout",
    });
  } else {
    res.send("Something went wrong.");
  }
};

/**
 * PUT /
 * Update Specific Note
 */
exports.dashboardUpdateNote = async (req, res) => {
  try {
    await Note.findOneAndUpdate(
      { _id: req.params.id },
      { title: req.body.title, body: req.body.body, updatedAt: Date.now() }
    ).where({ user: req.user.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

/**
 * DELETE /
 * Delete Note
 */
exports.dashboardDeleteNote = async (req, res) => {
  try {
    await Note.deleteOne({ _id: req.params.id }).where({ user: req.user.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

/**
 * GET /
 * Add Notes
 */
exports.dashboardAddNote = async (req, res) => {
  res.render("dashboard/add", {
    user: req.user,
    layout: "../views/layouts/layout",
  });
};

/**
 * POST /
 * Add Notes
 */
exports.dashboardAddNoteSubmit = async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Note.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

/**
 * GET /
 * Search
 */
exports.dashboardSearch = async (req, res) => {
  try {
    res.render("dashboard/search", {
      user: req.user,
      searchResults: "",
      layout: "../views/layouts/layout",
    });
  } catch (error) {}
};

/**
 * POST /
 * Search For Notes
 */
exports.dashboardSearchSubmit = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const searchResults = await Note.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChars, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChars, "i") } },
      ],
    }).where({ user: req.user.id });

    res.render("dashboard/search", {
      user: req.user,
      searchResults,
      layout: "../views/layouts/layout",
    });
  } catch (error) {
    console.log(error);
  }
};





