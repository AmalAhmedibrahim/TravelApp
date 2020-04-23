const request = require('supertest');
const server = require('../server/server');
import "babel-polyfill"

describe('Test  path', () => {
    test('It expect 200', async () => {
        const res = await request(server).get('/');
        expect(res.statusCode).toBe(200);
    });
});



describe("test result", () => {
    test("post method /add", async () => {
        const res = await request(server).post('/add');
        expect(res.statusCode).toBe(200);
    });
});




