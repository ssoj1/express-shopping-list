const request = require("supertest");

const app = require("../app");
let db = require("../fakeDb");

let popsicle = { name: "popsicle", price: 1.45 }

beforeEach(function () {
    db.items.push(popsicle);
});

afterEach(function () {
    db.items = [];
});
// end

/** GET /items : returns a list of all items: 
 *  { items: [
 *       { name: "popsicle", price: 1.45 }
 *  ]}
 */
describe("GET all items", function () {
    test("Get all items in database", async function () {
        const resp = await request(app).get(`/items`);
        expect(resp.body).toEqual(
            {
                "items": [
                    {
                        "name": "popsicle",
                        "price": 1.45
                    }
                ]
            }
        );
    });
});

/** GET /items/:name : returns a single item by name: 
 *  { name: "popsicle", price: 1.45 }
 */
describe("GET a single item", function () {
    test("Get popsicle in database", async function () {
        const resp = await request(app).get(`/items/${popsicle.name}`);
        expect(resp.body).toEqual(
            {
                "name": "popsicle",
                "price": 1.45
            }
        );
    });

    test("Get non existent cheerios in database", async function () {
        const resp = await request(app).get(`/items/cheerios`);
        expect(resp.body).toEqual(
            {
                "error": {
                    "message": "Not Found",
                    "status": 404
                }
            }
        );
    });
});


/** POST /items : add an item and return the JSON: 
 *   {added: {name: "strawberries", price: 4.99}}
*/
describe("POST items to database", function () {
    test("Adding one item to database", async function () {
        const resp = await request(app)
            .post(`/items`)
            .send({
                name: "strawberries",
                price: 4.99
            });
        expect(resp.body).toEqual(
            {
                "added": { // don't need to have strings around the keys as it's JS object
                    "name": "strawberries",
                    "price": 4.99
                }
            }
        );
    });
});

/**
 * PATCH /items/:name : accept JSON body, modify item, return it:
 *  {updated: {name: "new popsicle", price: 15.00}}
 */
describe("PATCH items in database", function () {
    test("Update one item in database", async function () {
        const resp = await request(app)
            .patch(`/items/${popsicle.name}`)
            .send({
                name: "new popsicles",
                price: 15.00
            });
        expect(resp.body).toEqual(
            {
                "updated": {
                    "name": "new popsicles",
                    "price": 15.00
                }
            }
        );
    });
});

/**
 * DELETE /items/:name : delete item, returns message:
 *  {message: "Deleted"}
 */
describe("DELETE items from database", function () {
    test("Delete an item from the database", async function () {
        const resp = await request(app).delete(`/items/${popsicle.name}`);
        expect(resp.body).toEqual(
            {
                "message": "Deleted"
            });
        expect(db.items.length).toEqual(0);
    });

    test("Delete a nonexistent item from the database", async function () {
        const resp = await request(app).delete(`/items/nothing`);
        expect(resp.body).toEqual(
            {
                "error": {
                    "message": "Not Found",
                    "status": 404
                }
            }
        );
        expect(db.items.length).toEqual(1);
    });
});