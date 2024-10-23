const supertest = require('supertest');

const request = supertest('http://localhost:3005');

test('Validate if the server responds on port 3005', () => {
  request.get('/')
    .then((res) => {
      expect(res.status).toBe(200);
    });
});
