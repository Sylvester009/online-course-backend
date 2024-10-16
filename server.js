const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const courseRoutes = require('./routes/course');
const enrollRoutes = require('./routes/enroll');

const app = express();
//middleware
app.use(morgan('dev'));
app.use(bodyParser.json({limit: "5mb"}));
app.use(bodyParser.urlencoded({
    limit: "5mb",
    extended: true
}));
app.use(cookieParser());
// app.use(express.json());
app.use(cors());

// mongoose.connect('mongodb+srv://samsylvester09:XLOLs4M822HTU62C@cluster0.gqks2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
//   .then(() => console.log('MongoDB connected'))
//   .catch((err) => console.log(err));

// database connection
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
  // useFindAndModify: false
}).then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));

// Basic route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', courseRoutes);
app.use('/api', enrollRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

