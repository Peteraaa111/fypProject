import Router, { RouterContext } from "koa-router";
import bodyParser from "koa-bodyparser";
import {
  getAcademicYearDocIds,
  getPhotoDocIds,
  getPhotogetPhotoActivityDocIds,
  getPhotoInActivity,
  uploadPhoto,
  addActivity,
  deleteImage,
  editUploadImage,
} from "../controllers/schoolActivity";
import multer from "@koa/multer";
import {DefaultState} from "koa";


export const setupSchoolActivityRoutes = (router: Router<DefaultState, RouterContext>): void => {
  const schoolActivityrouter = new Router<DefaultState, RouterContext>({prefix: "/api/v1/schoolActivity" });


  const uploadImage = multer({
    fileFilter(req, file, callback) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        callback(new Error("Please upload an image"), false);
      }
      callback(null, true);
    },
    dest: "temp",
  });


  schoolActivityrouter.get("/getAcademicYearDocIds",getAcademicYearDocIds);

  schoolActivityrouter.post("/getPhotoDocIds", bodyParser(), getPhotoDocIds);

  schoolActivityrouter.post("/getPhotoInActivity", bodyParser(), getPhotoInActivity);

  schoolActivityrouter.post("/uploadPhoto", uploadImage.any(), uploadPhoto);

  schoolActivityrouter.put("/editUploadPhoto", uploadImage.any(), editUploadImage);

  schoolActivityrouter.post("/getPhotogetPhotoActivityDocIds", bodyParser(), getPhotogetPhotoActivityDocIds);

  schoolActivityrouter.post("/addActivity",bodyParser(),addActivity);

  schoolActivityrouter.delete("/deletePhoto",bodyParser(),deleteImage);


  router.use(schoolActivityrouter.routes());
};