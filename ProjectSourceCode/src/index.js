const express = require('express'); // To build an application server or API
const app = express();
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const path = require('path');
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part C.
const { get } = require('http');

//-------------------------------------------------------------------------------------------------

// create `ExpressHandlebars` instance and configure the layouts and partials dir.
const hbs = handlebars.create({
  extname: 'hbs',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials',
});

// database configuration
const dbConfig = {
  host: 'db', // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.
app.use(express.static(path.join(__dirname, 'views/resources')));

// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
});

app.get('/', (req, res) => { // code to redirect to login poage 
  res.redirect('/login');
});

app.get('/login', (req, res) => { // code to render  login page 
  res.render('pages/login', { showNavbar: false });
});

app.get('/register', (req, res) => { // code to render register page 
  res.render('pages/register', { showNavbar: false });
});


app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate username to ensure it's not empty or consisting only of whitespace characters
    if (!username || username.trim() === '') {
      res.status(400).json({ message: 'Invalid input: Username cannot be empty or contain only whitespace characters.' });
      return;
    }
    
    // Check if username already exists
    const userExists = await db.oneOrNone('SELECT * FROM users WHERE username = $1', username);
    
    if (userExists) {
      // Username already exists, return an error message to the user
      console.log(userExists);
      res.render('pages/register', { message: 'User already exists. Please choose a different username.' });
      return; // Prevent further execution to avoid attempting to insert the duplicate username
    }

    // If the username doesn't exist, continue with hashing the password and inserting the new user
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password for security
    await db.none('INSERT INTO users(username, password) VALUES($1, $2)', [username, hashedPassword]);
    res.redirect('/login'); // Redirect the user to the login page upon successful registration
  } catch (error) {
    console.error('Error registering user:', error);
    res.render('pages/register', { message: 'Registration failed: ' + error.message }); // Show a generic error message for other errors
  }
});

app.get('/passwordReset' , async (req, res) => {
  res.render('pages/passwordReset');
})

app.post('/passwordReset', async (req, res) => {
  const { email } = req.body;
  // Assume emailRegex is your validation logic
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailRegex.test(email)) {
    // Email is in the correct format, proceed with logic and then render success page
    res.render('pages/success', { email }); // Pass the email as part of the rendering context
  } else {
    // Email is not in the correct format
    res.render('pages/passwordReset', { errorMessage: 'Email is not in valid format. It should be name@provider.com' });
  }
});



app.post('/login', async (req, res) => {
try {

  const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', req.body.username); // compare login credetials to those ones that exist

  if (!user) { // if user dose not match any exising users redirect to register page so they can register 
    res.redirect('/register');
  }
  
  const match = await bcrypt.compare(req.body.password, user.password);
  
    if (match) {
      req.session.user = user;
      req.session.save();
    res.status(200).redirect('/home')
  } else {
    res.status(401).render('pages/login', { message: 'Incorrect username or password.' }); // if username matches but credentils are incorrect message will display 
  }
} catch (error) {
  console.error('Error:', error);
  res.status(500).render('pages/login', { message: 'An error occurred. Please try again.' });
}
});
var currencies = {
  'USD': 'United States Dollar',
  'EUR': 'Euro',
  'AED': 'United Arab Emirates Dirham',
  'AFN': 'Afghan Afghani',
  'ALL': 'Albanian Lek',
  'AMD': 'Armenian Dram',
  'ANG': 'Netherlands Antillean Guilder',
  'AOA': 'Angolan Kwanza',
  'ARB': 'Arab Monetary Fund',
  'ARS': 'Argentine Peso',
  'AUD': 'Australian Dollar',
  'AVAX': 'Avalanche',
  'AWG': 'Aruban Florin',
  'AZN': 'Azerbaijani Manat',
  'BAM': 'Bosnia-Herzegovina Convertible Mark',
  'BBD': 'Barbadian Dollar',
  'BDT': 'Bangladeshi Taka',
  'BGN': 'Bulgarian Lev',
  'BHD': 'Bahraini Dinar',
  'BIF': 'Burundian Franc',
  'BMD': 'Bermudian Dollar',
  'BNB': 'Binance Coin',
  'BND': 'Brunei Dollar',
  'BOB': 'Bolivian Boliviano',
  'BRL': 'Brazilian Real',
  'BSD': 'Bahamian Dollar',
  'BTC': 'Bitcoin',
  'BTN': 'Bhutanese Ngultrum',
  'BWP': 'Botswana Pula',
  'BYN': 'Belarusian Ruble',
  'BYR': 'Belarusian Ruble (pre-2016)',
  'BZD': 'Belize Dollar',
  'CAD': 'Canadian Dollar',
  'CDF': 'Congolese Franc',
  'CHF': 'Swiss Franc',
  'CLF': 'Chilean Unit of Account (UF)',
  'CLP': 'Chilean Peso',
  'CNY': 'Chinese Yuan',
  'COP': 'Colombian Peso',
  'CRC': 'Costa Rican Colón',
  'CUC': 'Cuban Convertible Peso',
  'CUP': 'Cuban Peso',
  'CVE': 'Cape Verdean Escudo',
  'CZK': 'Czech Republic Koruna',
  'DAI': 'Dai',
  'DJF': 'Djiboutian Franc',
  'DKK': 'Danish Krone',
  'DOP': 'Dominican Peso',
  'DOT': 'Polkadot',
  'DZD': 'Algerian Dinar',
  'EGP': 'Egyptian Pound',
  'ERN': 'Eritrean Nakfa',
  'ETB': 'Ethiopian Birr',
  'ETH': 'Ethereum',
  'FJD': 'Fijian Dollar',
  'FKP': 'Falkland Islands Pound',
  'GBP': 'British Pound Sterling',
  'GEL': 'Georgian Lari',
  'GGP': 'Guernsey Pound',
  'GHS': 'Ghanaian Cedi',
  'GIP': 'Gibraltar Pound',
  'GMD': 'Gambian Dalasi',
  'GNF': 'Guinean Franc',
  'GTQ': 'Guatemalan Quetzal',
  'GYD': 'Guyanaese Dollar',
  'HKD': 'Hong Kong Dollar',
  'HNL': 'Honduran Lempira',
  'HRK': 'Croatian Kuna',
  'HTG': 'Haitian Gourde',
  'HUF': 'Hungarian Forint',
  'IDR': 'Indonesian Rupiah',
  'ILS': 'Israeli New Shekel',
  'IMP': 'Manx pound',
  'INR': 'Indian Rupee',
  'IQD': 'Iraqi Dinar',
  'IRR': 'Iranian Rial',
  'ISK': 'Icelandic Króna',
  'JEP': 'Jersey Pound',
  'JMD': 'Jamaican Dollar',
  'JOD': 'Jordanian Dinar',
  'JPY': 'Japanese Yen',
  'KES': 'Kenyan Shilling',
  'KGS': 'Kyrgystani Som',
  'KHR': 'Cambodian Riel',
  'KMF': 'Comorian Franc',
  'KPW': 'North Korean Won',
  'KRW': 'South Korean Won',
  'KWD': 'Kuwaiti Dinar',
  'KYD': 'Cayman Islands Dollar',
  'KZT': 'Kazakhstani Tenge',
  'LAK': 'Laotian Kip',
  'LBP': 'Lebanese Pound',
  'LKR': 'Sri Lankan Rupee',
  'LRD': 'Liberian Dollar',
  'LSL': 'Lesotho Loti',
  'LTC': 'Litecoin',
  'LTL': 'Lithuanian Litas',
  'LVL': 'Latvian Lats',
  'LYD': 'Libyan Dinar',
  'MAD': 'Moroccan Dirham',
  'MATIC': 'Polygon',
  'MDL': 'Moldovan Leu',
  'MGA': 'Malagasy Ariary',
  'MKD': 'Macedonian Denar',
  'MMK': 'Myanma Kyat',
  'MNT': 'Mongolian Tugrik',
  'MOP': 'Macanese Pataca',
  'MRO': 'Mauritanian Ouguiya (pre-2018)',
  'MRU': 'Mauritanian Ouguiya',
  'MUR': 'Mauritian Rupee',
  'MVR': 'Maldivian Rufiyaa',
  'MWK': 'Malawian Kwacha',
  'MXN': 'Mexican Peso',
  'MYR': 'Malaysian Ringgit',
  'MZN': 'Mozambican Metical',
  'NAD': 'Namibian Dollar',
  'NGN': 'Nigerian Naira',
  'NIO': 'Nicaraguan Córdoba',
  'NOK': 'Norwegian Krone',
  'NPR': 'Nepalese Rupee',
  'NZD': 'New Zealand Dollar',
  'OMR': 'Omani Rial',
  'OP': 'OpenDAO',
  'PAB': 'Panamanian Balboa',
  'PEN': 'Peruvian Nuevo Sol',
  'PGK': 'Papua New Guinean Kina',
  'PHP': 'Philippine Peso',
  'PKR': 'Pakistani Rupee',
  'PLN': 'Polish Zloty',
  'PYG': 'Paraguayan Guarani',
  'QAR': 'Qatari Rial',
  'RON': 'Romanian Leu',
  'RSD': 'Serbian Dinar',
  'RUB': 'Russian Ruble',
  'RWF': 'Rwandan Franc',
  'SAR': 'Saudi Riyal',
  'SBD': 'Solomon Islands Dollar',
  'SCR': 'Seychellois Rupee',
  'SDG': 'Sudanese Pound',
  'SEK': 'Swedish Krona',
  'SGD': 'Singapore Dollar',
  'SHP': 'Saint Helena Pound',
  'SLL': 'Sierra Leonean Leone',
  'SOL': 'Solana',
  'SOS': 'Somali Shilling',
  'SRD': 'Surinamese Dollar',
  'STD': 'São Tomé and Príncipe Dobra',
  'STN': 'São Tomé and Príncipe Dobra',
  'SVC': 'Salvadoran Colón',
  'SYP': 'Syrian Pound',
  'SZL': 'Swazi Lilangeni',
  'THB': 'Thai Baht',
  'TJS': 'Tajikistani Somoni',
  'TMT': 'Turkmenistan Manat',
  'TND': 'Tunisian Dinar',
  'TOP': 'Tongan Paʻanga',
  'TRY': 'Turkish Lira',
  'TTD': 'Trinidad and Tobago Dollar',
  'TWD': 'New Taiwan Dollar',
  'TZS': 'Tanzanian Shilling',
  'UAH': 'Ukrainian Hryvnia',
  'UGX': 'Ugandan Shilling',
  'USD': 'United States Dollar',
  'USDC': 'USD Coin',
  'USDT': 'Tether',
  'UYU': 'Uruguayan Peso',
  'UZS': 'Uzbekistani Som',
  'VEF': 'Venezuelan Bolívar',
  'VES': 'Venezuelan Bolívar Soberano',
  'VND': 'Vietnamese Đồng',
  'VUV': 'Vanuatu Vatu',
  'WST': 'Samoan Tala',
  'XAF': 'Central African CFA Franc',
  'XAG': 'Silver (troy ounce)',
  'XAU': 'Gold (troy ounce)',
  'XCD': 'East Caribbean Dollar',
  'XDR': 'Special Drawing Rights',
  'XOF': 'West African CFA Franc',
  'XPD': 'Palladium (troy ounce)',
  'XPF': 'CFP Franc',
  'XPT': 'Platinum (troy ounce)',
  'XRP': 'Ripple',
  'YER': 'Yemeni Rial',
  'ZAR': 'South African Rand',
  'ZMK': 'Zambian Kwacha (pre-2013)',
  'ZMW': 'Zambian Kwacha',
  'ZWL': 'Zimbabwean Dollar'
};

app.get('/api/convert_currency', (req,res)=>{
const apiKey = process.env.API_KEY; 
axios({
  method: 'get',
  url: 'https://api.currencyapi.com/v3/latest',
  params:{
    ...req.query,
    apikey: apiKey
  }
  })
.then(async response=>{
  console.log(response.data);
  const rate = response.data.data[req.query.to_currency].value;
  const convertedAmount = rate * req.query.amount;
  const {converted_amount} = await db.one(
    'INSERT INTO conversions(user_id, from_currency, to_currency, amount, rate) VALUES($1, $2, $3, $4, $5) RETURNING converted_amount',
      [req.session.user.user_id, req.query.base_currency, req.query.to_currency, req.query.amount, rate]
    );
  res.status(response.status).json({rate: rate, amount: convertedAmount});
})
.catch(error=>{
  console.error('Error', error)
  res.status(500).json({error: 'Error'});
});
});

// Authentication Middleware.
const auth = (req, res, next) => {
if (!req.session.user) {
  // Default to login page.
  return res.redirect('/login');
}
next();
};

// Authentication Required
app.use(auth);

app.get('/profile', (req, res) => {
  res.render('pages/profile', { showNavbar: true });
});

app.get('/home', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  const userId = req.session.user.user_id;

  try {
    const searchHistory = await db.any(
      'SELECT from_currency, to_currency, amount, converted_amount, created_at FROM conversions WHERE user_id = $1 ORDER BY created_at DESC',
      userId
    );
    res.render('pages/home', { searchHistory, showNavbar: true });
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.render('pages/home', { searchHistory: [], error: 'Error fetching your search history', showNavbar: true });
  }
});



app.post('/convert_currency', async (req, res) => {
  if (!req.session.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { from_currency, to_currency, amount, converted_amount } = req.body;
  const userId = req.session.user.user_id;

  try {
    await db.none(
      'INSERT INTO conversions(user_id, from_currency, to_currency, amount, converted_amount) VALUES($1, $2, $3, $4, $5)',
      [userId, from_currency, to_currency, amount, converted_amount]
    );
    res.json({ message: "Conversion saved" });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/currency_converter', (req, res) => {
  const { from, to } = req.query;
  res.render('pages/currency_converter', {
    showNavbar: true, 
    from_currency: from || '',
    to_currency: to || '',
    amount: '' 
  });
});


app.get('/news', (req, res) => {
  const api_Key = "5edee46983924da28b3db8bec752ad72";
  console.log(api_Key);
  axios({
      method: 'get',
      url: 'https://newsapi.org/v2/everything',
      params: {
          q : 'currency exchange',
          language: 'en',
          apiKey : api_Key,
      }
  })
.then(response => {
    console.log(response.data);
    res.render('pages/news', {
        showNavbar: true,
        articles: response.data.articles.map(article => ({
            title: article.title,
            description: article.description,
            url: article.url,
            imageURL: article.urlToImage
        }))
    });
})
  .catch(error => {
      console.error('Error', error);
      // Sending a JSON response in case of error
      res.status(500).json({ error: 'Internal Server Error' });
  });
});


app.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err); // destroy current session and exit our of the login page 
        return res.redirect('/'); 
      }
      res.clearCookie('connect.sid');
      res.render('pages/logout', { showNavbar: false })
    });
  });
  
  
  // *****************************************************
  // <!-- Section 5 : Start Server-->
  // *****************************************************
  // starting the server and keeping the connection open to listen for more requests
  module.exports = app.listen(3000);
  console.log('Server is listening on port 3000');



