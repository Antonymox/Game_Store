const express = require("express")
const router = express.Router()
const authRoutes = require("./auth")
const forumRoutes = require("./forum")
const threadRoutes = require("./thread")
const postRoutes = require("./post")
const userRoutes = require("./user")
const cartRoutes = require("./cart")

router.use("/auth", authRoutes)
router.use("/forums", forumRoutes)
router.use("/threads", threadRoutes)
router.use("/posts", postRoutes)
router.use("/users", userRoutes)
router.use("/cart", cartRoutes)

module.exports = router
