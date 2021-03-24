const db = require("../../models/db");
let Badges = class Badges {


    static getAll(page) {
        return new Promise((resolve, reject) => {
            if (!page) return reject(new Error("Missing page"))
            const skip = (page * 15) - 15;

            db.query("SELECT * FROM badges LIMIT 15 OFFSET ?", [skip], (err, result) => {
                if (err) return reject(new Error(err.message))
                else resolve(result)
            })

        })
    }
    static add(name, user, userPermissions) {
        return new Promise((resolve, reject) => {
            if (!name) return reject(new Error("Missing name"))
            if (!user) return reject(new Error("Missing user"))
            if (!userPermissions) return reject(new Error("Missing userPermissions"))
            if (userPermissions < 3) return reject(new Error("Bad permissions"))
            db.query('INSERT INTO badges (badge_name, badge_user) VALUES (?, (SELECT member_id FROM members WHERE member_pseudo = ?))', [name, user], (err, result) => {
                if (err) return reject(new Error(err.message))
                else resolve(true)
            })
        })
    }
    static delete(badgeId, userPermissions) {
        return new Promise((resolve, reject) => {
            if (!badgeId) return reject(new Error("Missing badge"))
            if (!userPermissions) return reject(new Error("Missing userPermissions"))
            if (userPermissions < 3) return reject(new Error("Bad permissions"))

            db.query("DELETE FROM badges WHERE badge_id = ?", [badgeId], (err, result) => {
                if (err) return reject(new Error(err.message))
                else resolve(true)
            })

        })
    }
}

module.exports = Badges