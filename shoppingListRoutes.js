const express = require("express");

const db = require("./fakeDb");
const router = new express.Router();

const { NotFoundError } = require("./expressError");

/** Find an item by name */
function getItem(name) {

    for (item of db.items) {
        if (item.name === name) {
            return item;
        }
    }
    throw new NotFoundError();
}

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
    let name = req.body.name;
    let price = req.body.price;

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

router.patch("/:name", function (req, res) {
    let reqName = req.params.name;
    let newName = req.body.name;
    let newPrice = req.body.price;

    let item = getItem(reqName);
    console.log("PATCH item", item)
    item.name = newName;
    item.price = newPrice;

    return res.json({ updated: item });

})

router.delete("/:name", function (req, res) {
    let reqName = req.params.name;
    let index = itemIndex(reqName);

    db.items.splice(index, 1);

    return res.json({ message: "Deleted" });
})


module.exports = router;