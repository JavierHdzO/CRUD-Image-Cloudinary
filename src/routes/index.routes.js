const { Router } = require("express");
const Photo = require("../models/Photo");
const router = Router();
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const fs = require("fs-extra");

router.get("/", async (req, res) => {

    try {
      const photos =   await Photo.find().lean();
      res.render("image", { photos });
    } catch (error) {
        console.error(error);
    }
 
});


router.get("/image/add",async (req, res) => {
    const photos = await Photo.find().lean();
    res.render("imagesForms", {photos} );
});






router.post("/image/add", async (req, res) => {
  const { title, description } = req.body;

  try {
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    console.log(result);

    const newPhoto = new Photo({
      title,
      description,
      imageURL: result.secure_url,
      public_id: result.public_id,
    });

    await newPhoto.save();
    await fs.unlink(req.file.path);
  } catch (error) {
    console.error(error);
  }

  res.redirect('/');
});


router.get('/images/:id/delete', async( req, res ) =>{
    const { id } = req.params;
   
    try {
        const photo = await Photo.findByIdAndDelete(id);
        await cloudinary.v2.uploader.destroy(photo.public_id);
        res.redirect("/image/add");
    } catch (error) {
        console.error(error);
    }


});




module.exports = router;
