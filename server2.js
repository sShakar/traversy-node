import { createServer } from "http";

const PORT = process.env.PORT;

const userIdRegex = /\/api\/users\/([0-9]+)/;

const users = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Doe" },
  { id: 3, name: "Jim Doe" },
];

// Logger middleware
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

// JSON Middleware

const jsonMiddleware = (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
  res.end();
};

// Route handles for GET /api/users
const getUsersHandler = (req, res) => {
  res.write(JSON.stringify(users));
};

// Route handler for GET /api/users/:id
const getUserByIdHandler = (req, res) => {
  const id = req.url.split("/")[3];
  const user = users.find((user) => user.id === parseInt(id));

  if (user) {
    res.write(JSON.stringify(user));
  } else {
    res.statusCode = 404;
    res.write(JSON.stringify({ message: "User not found." }));
  }
};

// Not found handler
const notFoundHandler = (req, res) => {
  res.statusCode = 404;
  res.write(JSON.stringify({ message: "Route not found." }));
};

const server = createServer((req, res) => {
  logger(req, res, () => {
    jsonMiddleware(req, res, () => {
      if (req.url === "/api/users" && req.method === "GET") {
        getUsersHandler(req, res);
      } else if (req.url.match(userIdRegex) && req.method === "GET") {
        getUserByIdHandler(req, res);
      } else if (req.url === "/api/users" && req.method === "POST") {
        createUserHandler(req, res);
      } else {
        notFoundHandler(req, res);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
