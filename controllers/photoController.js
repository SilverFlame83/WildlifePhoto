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

  res.render("catalog", {photos});
});

router.get('/details/:id', async (req,res)=>{
  const photo = await req.storage.getPhotoById(req.params.id);

  res.render('details', {photo})
});



module.exports = router;
