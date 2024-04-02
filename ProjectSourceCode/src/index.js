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

function clearFields() {
    // Clear the input fields
    document.querySelector("input[type='text']").value = '';
    document.querySelector("input[type='number']").value = '';

    // Reset the content of the converted currency card
    document.querySelector('.card-title').textContent = 'Converted Currency:';
    document.querySelector('.card-text:nth-of-type(1)').textContent = 'Please enter values to see the converted currency';
    document.getElementById('exchangeRate').textContent = '---';
}

const apiKey = process.env.API_KEY;
// Global list of currencies (you would fill this list with all available currencies)
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

function filterCurrencies(type) {
    var input, filter, ul, li, a, i;
    input = document.getElementById(type === 'from' ? 'fromCurrencyInput' : 'toCurrencyInput');
    filter = input.value.toUpperCase();
    div = document.getElementById(type === 'from' ? 'fromCurrencyList' : 'toCurrencyList');
    div.innerHTML = ''; // Clear previous options
    if (filter) {
        for (code in currencies) {
            // Check if the currency code or name contains the search term
            if (code.indexOf(filter) > -1 || currencies[code].toUpperCase().indexOf(filter) > -1) {
                div.innerHTML += `<div class="currency-list-item" onclick="selectCurrency('${type}', '${code}')">${code} - ${currencies[code]}</div>`;
            }
        }
        div.classList.add('visible');
    } else {
        div.classList.remove('visible');
    }
}

function selectCurrency(type, code) {
    // Set the input value and hide the suggestion list
    document.getElementById(type === 'from' ? 'fromCurrencyInput' : 'toCurrencyInput').value = code;
    document.getElementById(type === 'from' ? 'fromCurrencyList' : 'toCurrencyList').classList.remove('visible');
}
function convertCurrency() {
    // Retrieve the selected currencies from the inputs
    const fromCurrency = document.getElementById('fromCurrencyInput').value.toUpperCase();
    const toCurrency = document.getElementById('toCurrencyInput').value.toUpperCase();
    const amount = document.getElementById('amountInput').value;

    // Construct the API URL with proper currency codes and the amount
    const url = `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&base_currency=${fromCurrency}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.data[toCurrency]) {
                const rate = data.data[toCurrency].value;
                const convertedAmount = rate * amount;
                document.getElementById('exchangeRate').textContent = `${amount} ${fromCurrency} is equal to ${convertedAmount.toFixed(6)} ${toCurrency}`;
                document.getElementById('conversionText').textContent = `${fromCurrency} to ${toCurrency}`;
            } else {
                document.getElementById('exchangeRate').textContent = 'Currency code not found';
                document.getElementById('conversionText').textContent = 'Conversion error';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('exchangeRate').textContent = 'Error fetching exchange rate';
            document.getElementById('conversionText').textContent = 'Conversion error';
        });
}



function clearFields() {
    document.getElementById('currencyCodeInput').value = '';
    document.getElementById('amountInput').value = '';
    document.getElementById('exchangeRate').textContent = '-';
    document.getElementById('conversionText').textContent = 'Euro (EUR) to U.S Dollar (USD)';
}

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


app.get('/', (req, res) => { // code to redirect to login poage 
  res.redirect('/login');
});

app.get('/login', (req, res) => { // code to render  login page 
  res.render('pages/login');
});

app.get('/register', (req, res) => { // code to render registyer page 
  res.render('pages/register');
});

app.get('/profile', (req, res) => {
  res.render('pages/profile');
});

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username already exists
    const userExists = await db.oneOrNone('SELECT * FROM users WHERE username = $1', username);
    
    if (userExists) {
      // Username already exists, return an error message to the user
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


app.post('/login', async (req, res) => {
try {

  const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', req.body.username); // compare login credetials to those ones that exist
  
  if (!user) { // if user dose not match any exising users redirect to register page so they can register 
    res.redirect('/register');
    return;
  }
  
  const match = await bcrypt.compare(req.body.password, user.password);
  
    if (match) {
      req.session.user = user;
      req.session.save();
    res.redirect('/home')
  } else {
    res.render('pages/login', { message: 'Incorrect username or password.' }); // if username matches but credentils are incorrect message will display 
  }
} catch (error) {
  console.error('Error:', error);
  res.render('pages/login', { message: 'An error occurred. Please try again.' });
}
});

app.get('/home', (req,res)=>{
  res.render('pages/home');
});

app.get('/profile', (req,res)=>{
  res.render('pages/profile');
});

app.get('/currency_converter', (req,res)=>{
  res.render('pages/currency_converter');
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

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err); // destroy current session and exit our of the login page 
        return res.redirect('/'); 
      }
      res.clearCookie('connect.sid');
      res.render('pages/logout')
    });
  });
  
  
  // *****************************************************
  // <!-- Section 5 : Start Server-->
  // *****************************************************
  // starting the server and keeping the connection open to listen for more requests
  app.listen(3000);
  console.log('Server is listening on port 3000');