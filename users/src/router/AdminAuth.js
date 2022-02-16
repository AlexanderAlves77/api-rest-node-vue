const axios = require("axios")

module.exports = function(to, from, next) {
    const req = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }
    
    if (localStorage.getItem('token') !== undefined) {
      axios.post("http://localhost:8686/validate", {}, req).then(res => {
        console.log(res)
        next()
      }).catch(err => {
        console.log(err.response)
        next("/login")
      })
      next()
    } else {
      next("/login")
    }
}
