const express =require("express");
const passport = require('./config/googleAuth');
const session = require("express-session"); 
const authRoutes = require('./routes/auth.routes'); 
const fitnessRoutes = require("./routes/fitness.routes");
const productRoutes = require('./routes/product.routes');
const trailRoutes= require('./routes/trail.routes');
const membershipRoutes = require("./routes/membership.routes");
const cors = require("cors")
const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize()); 


app.use('/api/auth', authRoutes);
app.use("/api/fitness",fitnessRoutes);
app.use("/api", require("./routes/chat.routes"))
app.use('/api/shop',  productRoutes); 
app.use("/api/food", require("./routes/food.js"));
app.use("/api/exercises", require("./routes/exercise.routes"));
app.use("/api/contact", require("./routes/contact.routes"));
app.use("/api/auth/trial", trailRoutes)
app.use("/api/membership", membershipRoutes);
module.exports=app;