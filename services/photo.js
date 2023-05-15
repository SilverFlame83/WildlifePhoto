const Photo = require("../models/Photo");

async function getAllPhoto() {
  return Photo.find().populate("owner").lean();
}

async function getPhotoById(id) {
  return Photo.findById(id).populate("owner").lean();
}

async function createPhoto(photoData) {
  const photo = new Photo(photoData);

  await photo.save();

  return photo;
}

async function editPhoto(id, photoData) {
  const photo = await Photo.findById(id);

  photo.title = photoData.title;
  photo.keyword = photoData.keyword;
  photo.location = photoData.location;
  photo.dateOfCreation = photoData.dateOfCreation;
  photo.imageUrl = photoData.imageUrl;
  photo.description = photoData.description;
  photo.rating = photoData.rating;

  return photo.save();
}

async function deletePhoto(id) {
  await Photo.findByIdAndDelete(id);
}

async function votePhotoPositive(photoId, userId){
  const photo = await Photo.findById(photoId);

    photo.votes.push(userId);

  return photo.save();
}

async function votePhotoNegative(){

}


module.exports= {
  getAllPhoto,
  getPhotoById,
  createPhoto,
  editPhoto,
  votePhotoPositive,
  deletePhoto
}