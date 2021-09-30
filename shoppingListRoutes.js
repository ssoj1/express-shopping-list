const express = require("express");

const db = require("./fakeDb");
const router = new express.Router();

const { NotFoundError } = require("./expressError");

// not bad to have here since they're small/short
// may consider moving them to a util.js file

// could be replaced with built in Array.find()
/** Find an item by name */
function getItem(name) {

    for (item of db.items) {
        if (item.name === name) {
            return item;
        }
    }
    throw new NotFoundError();
}
// need docstring
// could be replaced with built in Arrayy.findIndex()
function itemIndex(name) {

    for (let i = 0; i < db.items.length; i++) {
        if (db.items[i].name === name) {
            return i;
        }
    }
    throw new NotFoundError();
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
    let name = req.body.name; // object destructuring would be better
    let price = req.body.price; // be more consistent with let/const use; const should be for non-changing values

    db.items.push({ name, price });

    return res.json({ added: { name, price } });
});

/** GET /items/:name : returns a single item by name: 
 *  { name: "name", price: # }
 */
router.get("/:name", function (req, res) {
    let reqName = req.params.name;

    let item = getItem(reqName);

    return res.json(item);
});

/**
 * PATCH /items/:name : accept JSON body, modify item, return it:
 *  {updated: {name: "new popsicle", price: 2.45}}
 */

router.patch("/:name", function (req, res) {
    let reqName = req.params.name; // could also do object destructuring
    let newName = req.body.name;
    let newPrice = req.body.price;

    let item = getItem(reqName);
    console.log("PATCH item", item)
    item.name = newName;
    item.price = newPrice;

    return res.json({ updated: item });

})

/**
 * DELETE /items/:name : delete item, returns message:
 *  {message: "Deleted"}
 */

router.delete("/:name", function (req, res) {
    let reqName = req.params.name;
    let index = itemIndex(reqName);

    db.items.splice(index, 1);

    return res.json({ message: "Deleted" });
})


module.exports = router;