import multer from "multer";

const storage = multer.memoryStorage(); // store image in memory
const upload = multer({
  storage: storage,
});
const SingleAvatar = upload.single("avatar");

const attachementsMulter = upload.array("attachments")

export { SingleAvatar , attachementsMulter };
