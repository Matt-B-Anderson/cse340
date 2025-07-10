/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");

/* ***********************
 * View Engine and Template
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static);
// Index route
app.get("/", function (reg, res) {
	res.render("index", {
		title: "CSE Motors",
		siteName: "CSE Motors",
		navLinks: [
			{ href: "/", text: "Home" },
			{ href: "/custom", text: "Custom" },
			{ href: "/sedan", text: "Sedan" },
			{ href: "/suv", text: "SUV" },
			{ href: "/truck", text: "Truck" },
		],
		accountHref: "/account",
		accountText: "My Account",
		welcomeTitle: "Welcome to CSE Motors!",
		carName: "DMC Delorean",
		carImage: "delorean.jpg",
		carImageAlt: "Cartoon drawing of a DMC Delorean car",
		carFeatures: ["3 Cup holders", "Superman doors", "Fuzzy dice!"],
		promoButtonHref: "/purchase",
		promoButtonText: "Own Today",
		reviewsTitle: "DMC Delorean Reviews",
		reviews: [
			'"So fast it\'s almost like traveling in time." (4/5)',
			'"Coolest ride on the road." (4/5)',
			'"I\'m feeling McFly!" (5/5)',
			'"The most futuristic ride of our day." (4.5/5)',
			'"80\'s livin and I love it!" (5/5)',
		],
		upgradesTitle: "Delorean Upgrades",
		upgrades: [
			{
				image: "flux-cap.png",
				alt: "Flux Capacitor",
				name: "Flux Capacitor",
				link: "/upgrades/flux",
			},
			{
				image: "flame.jpg",
				alt: "Flame Decals",
				name: "Flame Decals",
				link: "/upgrades/flame",
			},
			{
				image: "bumper_sticker.jpg",
				alt: "Bumper Stickers",
				name: "Bumper Stickers",
				link: "/upgrades/bumper",
			},
			{
				image: "hub-cap.jpg",
				alt: "Hub Caps",
				name: "Hub Caps",
				link: "/upgrades/hubcaps",
			},
		],
	});
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
	console.log(`app listening on ${host}:${port}`);
});
