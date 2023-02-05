export const getJoin = (req, res) => {
    return res.render("join.ejs", { title : "Join" });
}

export const postJoin = (req,res) => {
    console.log(req.body);
    return res.redirect("/");
}
