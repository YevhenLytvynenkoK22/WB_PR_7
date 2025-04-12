const express = require("express");
const app = express();
const port = 5000;

let posts = [];
let users = [];
let products = [];
let messages = [];
let appointments = [];

//Task1
app.get("/posts", (req, res) => {
  res.json(posts);
});

app.get("/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === Number(req.params.id));
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
});

app.post("/posts", (req, res) => {
  const newPost = {
    id: posts.length + 1,
    title: req.body.title,
    content: req.body.content,
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});

app.put("/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === Number(req.params.id));
  if (!post) return res.status(404).json({ message: "Post not found" });
  post.title = req.body.title || post.title;
  post.content = req.body.content || post.content;
  res.json(post);
});

app.delete("/posts/:id", (req, res) => {
  const index = posts.findIndex((p) => p.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Post not found" });
  posts.splice(index, 1);
  res.json({ message: "Post deleted" });
});

//Task2

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }
  const newUser = { id: users.length + 1, username, password };
  users.push(newUser);
  res.status(201).json({ message: "User registered successfully" });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const token = generateToken(username);
  res.json({ token });
});

app.get("/profile", authenticateToken, (req, res) => {
  res.json({ id: req.user.id, username: req.user.username });
});

//Task3
app.get("/products", (req, res) => {
  const category = req.query.category;
  if (category) {
    const filtered = products.filter((p) => p.category === category);
    return res.json(filtered);
  }
  res.json(products);
});

app.get("/products/:id", (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

app.post("/products", (req, res) => {
  const newProduct = {
    id: products.length + 1,
    name: req.body.name,
    price: req.body.price,
    category: req.body.category || "general",
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.put("/products/:id", (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ message: "Product not found" });
  product.name = req.body.name || product.name;
  product.price = req.body.price || product.price;
  product.category = req.body.category || product.category;
  res.json(product);
});

app.delete("/products/:id", (req, res) => {
  const index = products.findIndex((p) => p.id === Number(req.params.id));
  if (index === -1)
    return res.status(404).json({ message: "Product not found" });
  products.splice(index, 1);
  res.json({ message: "Product deleted" });
});

//Task4
const logMessage = (req, res, next) => {
  console.log(`New message: ${JSON.stringify(req.body)}`);
  next();
};

app.get("/messages", (req, res) => {
  const fromUser = req.query.from;
  if (fromUser) {
    const filtered = messages.filter((m) => m.from === fromUser);
    return res.json(filtered);
  }
  res.json(messages);
});

app.post("/messages", logMessage, (req, res) => {
  const newMessage = {
    id: messages.length + 1,
    from: req.body.from,
    to: req.body.to,
    content: req.body.content,
  };
  messages.push(newMessage);
  res.status(201).json(newMessage);
});

//Task5
const isTimeAvailable = (appointmentTime) => {
  return !appointments.find((a) => a.time === appointmentTime);
};

app.post("/appointments", (req, res) => {
  const { userId, time } = req.body;
  if (!isTimeAvailable(time)) {
    return res.status(400).json({ message: "Selected time is not available" });
  }
  const newAppointment = {
    id: appointments.length + 1,
    userId,
    time,
    details: req.body.details || "",
  };
  appointments.push(newAppointment);
  res.status(201).json(newAppointment);
});

app.get("/appointments/:id", (req, res) => {
  const appointment = appointments.find((a) => a.id === Number(req.params.id));
  if (!appointment)
    return res.status(404).json({ message: "Appointment not found" });
  res.json(appointment);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
