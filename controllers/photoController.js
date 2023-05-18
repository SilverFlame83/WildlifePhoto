const router = require("express").Router();
const { isUser } = require("../middlewares/guards");
const { parseError } = require("../util/parsers");

router.get("/create", async (req, res) => {
  res.render("create");
});

router.post("/create", isUser(), async (req, res) => {
  try {
    const photoData = {
      title: req.body.title,
      keyword: req.body.keyword,
      location: req.body.location,
      dateOfCreation: req.body.dateOfCreation,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
      rating: req.body.rating,
      owner: req.user._id,
    };

    await req.storage.createPhoto(photoData);

    res.redirect("/photo/catalog");
  } catch (err) {
    console.log(err.message);

    const ctx = {
      errors: parseError(err),
      photoData: {
        title: req.body.title,
        keyword: req.body.keyword,
        location: req.body.location,
        dateOfCreation: req.body.dateOfCreation,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        rating: req.body.rating,
      },
    };
    res.render("create", ctx);
  }
});

router.get("/catalog", async (req, res) => {
  const photos = await req.storage.getAllPhoto();

  res.render("catalog", { photos });
});

router.get("/details/:id", isUser(), async (req, res) => {
  const photo = await req.storage.getPhotoById(req.params.id);

  const [year, day, month] = photo.dateOfCreation
    .toLocaleDateString("EU")
    .split("/");

  let currentDate = `${day.padStart(2, "0")}.${month.padStart(2, "0")}.${year}`;
  photo.isOwner = req.user && req.user._id == photo.owner._id;

  photo.vote = req.user && photo.votes.find((u) => u == req.user._id);
  let voteUsers = [];

  for (let user of photo.votes) {
    let u = await req.storage.getUserById(user);

    voteUsers.push(u.email);
  }

  console.log(voteUsers);
  res.render("details", { photo, currentDate, voteUsers });
});

router.get("/votePositive/:id", isUser(), async (req, res) => {
  try {
    await req.storage.votePhotoPositive(req.params.id, req.user._id);

    res.redirect("/photo/details/" + req.params.id);
  } catch (err) {
    console.log("Error", err.message);
    res.redirect("/photo/details/" + req.params.id);
  }
});

router.get("voteNegative/:id", isUser(), async (req, res) => {
  try {
    await req.storage.votePhotoNegative(req.params.id, req.user._id);

    res.redirect("/photo/details/" + req.params.id);
  } catch (err) {
    console.log("Error", err.message);
    res.redirect("/photo/details/" + req.params.id);
  }
});

router.get("/edit/:id", isUser(), async (req, res) => {
  try {
    const photo = await req.storage.getPhotoById(req.params.id);

    res.render("edit", { photo });
  } catch (err) {
    console.log(err.message);
    res.redirect("/photo/details/" + req.params.id);
  }
});

router.post("/edit/:id", isUser(), async (req, res) => {
  try {
    await req.storage.editPhoto(req.params.id, req.body);

    res.redirect("/photo/details/" + req.params.id);
  } catch (err) {
    const ctx = {
      errors: parseError(err),
      phtot: {
        _id: req.params.id,
        title: req.body.title,
        keyword: req.body.keyword,
        location: req.body.location,
        dateOfCreation: req.body.dateOfCreation,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        rating: req.body.rating,
      },
    };
    res.render("edit", ctx);
  }
});

module.exports = router;
