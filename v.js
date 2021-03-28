const express = require("express");
const dashboard = express();
const path = require("path");
const passport = require("passport");
const Strategy = require("passport-discord").Strategy;
const session = require("express-session");
const MemoryStore = require("memorystore")(session);

module.exports = client => {

	const dashboardDirectory = path.resolve(
		`${process.cwd()}${path.sep}dashboard`
	);
	const templatesDirectory = path.resolve(`${dashboardDirectory}${path.sep}templates`);

	dashboard.use(
		"/public",
		express.static(path.resolve(`${dashboardDirectory}${path.sep}public`))
	);

	passport.use(
		new Strategy(
			{
				clientID: client.appInfo.id,
				clientSecret: client.config.dashboard.oauthSecret,
				callbackURL: client.config.dashboard.callbackUrl,
				scope: ["identity", "guilds"]
			},
			(accessToken, refreshToken, profile, done) => {
				process.nextTick(() => done(null, profile));
			}
		)
	);

	dashboard.use(
		session({
			store: new MemoryStore({ checkPeriod: 99999999 }),
			secret: client.config.dashboard.sSecret,
			resave: false,
			saveUninitialized: false
		})
	);

	dashboard.use(passport.initialize());
	dashboard.use(passport.session());

	dashboard.engine("html", require("ejs").renderFile);
	dashboard.set("view engine", "html");

	const renderTemplate = (res, req, template, data = {}) => {
		const baseData = {
			bot: client,
			path: req.path,
			user: req.isAuthenticated() ? req.user : null
		};
		res.render(
			path.resolve(`${templatesDirectory}${path.sep}${template}`),
			Object.assign(baseData, data)
		);
	};

	dashboard.get("/", (req, res) => {
		renderTemplate(res, req, "home.ejs")
	});

};

