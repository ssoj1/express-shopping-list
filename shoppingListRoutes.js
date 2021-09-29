const express = require("express");

const db = require("./fakeDb");
const router = new express.Router();

const { NotFoundError } = require("./expressError");

/** Find an item by name */
function getItem(name){
    for (item of db.items){
        if(item.name === name){
            return item;
        } 
    }
    throw new NotFoundError()
}

/** GET /items : returns a list of all items: 
 * { items: [
  { name: "name", price: # }
]}
 */
router.get("/", function (req, res) {
    return res.json({ items: db.items });
});

/** POST /items : add an item and return the JSON: 
 *   {added: {name: "name", price: #}}
*/
router.post("/", function (req, res) {
    let name = req.body.name;
    let price = req.body.price;

    db.items.push({name, price});

    return res.json({added: { name, price }});
});

/** GET /items/:name : returns a single item by name: 
 *  { name: "name", price: # }
 */
router.get("/:name", function (req, res) {
    let reqName = req.body.name;
    let item = getItem(reqName);

    return res.json( item );
});

module.exports = router;