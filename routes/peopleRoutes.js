const express = require("express");
const peopleController = require("../controllers/peopleController");

const router = express.Router();

router.get("/", peopleController.getPeople);
router.post("/", peopleController.createPerson);
router.put("/:id", peopleController.updatePerson);
router.delete("/:id", peopleController.deletePerson);

module.exports = router;