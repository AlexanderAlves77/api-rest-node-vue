class HomeController{

    async index(req, res){
        res.send("APP EXPRESS! - Fulldevstacks");
    }

    async validate(req, res) {
        res.send("OK")
    }
}

module.exports = new HomeController();