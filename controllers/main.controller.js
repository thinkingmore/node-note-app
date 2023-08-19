/**
 * GET /
 * Homepage 
*/
exports.homepage = async (req, res) => {
    const locals = {
      title: "Add Note App",
      description: "Take notes.",
    }
    res.render('pages/index', {
      user: req.user,
      layout: "../views/layouts/layout",
    });
}
  
  
  /**
   * GET /
   * About 
  */
  exports.about = async (req, res) => {
    const locals = {
      title: "About - Add Note App",
      description: "Add note about pages.",
    }
    res.render('pages/about',{
      user: req.user,
      layout: "../views/layouts/layout",
    })
  }
 