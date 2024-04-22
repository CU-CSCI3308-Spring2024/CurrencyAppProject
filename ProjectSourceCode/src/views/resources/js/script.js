let CHARTS = [];

function clearFields() {
    // Clear the input fields
    document.querySelector("input[type='text']").value = '';
    document.querySelector("input[type='number']").value = '';

    // Reset the content of the converted currency card
    document.querySelector('.card-title').textContent = 'Converted Currency:';
    document.querySelector('.card-text:nth-of-type(1)').textContent = 'Please enter values to see the converted currency';
    document.getElementById('exchangeRate').textContent = '---';
}

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
    var input, filter, div, i;
    input = document.getElementById(type === 'from' ? 'fromCurrencyInput' : 'toCurrencyInput');
    filter = input.value.toUpperCase();
    div = document.getElementById(type === 'from' ? 'fromCurrencyList' : 'toCurrencyList');
    div.innerHTML = ''; 
    if (filter) {
        for (code in currencies) {
            if (code.indexOf(filter) > -1 || currencies[code].toUpperCase().indexOf(filter) > -1) {
                var listItem = document.createElement('div');
                listItem.className = 'currency-list-item';
                listItem.textContent = `${code} - ${currencies[code]}`;
                listItem.setAttribute('data-currency', code);
                listItem.onclick = function() { selectCurrency(type, this.getAttribute('data-currency')); };
                div.appendChild(listItem);
            }
        }
        div.classList.add('visible');
    } else {
        div.classList.remove('visible');
    }
}


function selectCurrency(type, code) {
    // Set the input value and hide the suggestion list
    var input = document.getElementById(type === 'from' ? 'fromCurrencyInput' : 'toCurrencyInput');
    input.value = code;
    var list = document.getElementById(type === 'from' ? 'fromCurrencyList' : 'toCurrencyList');
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    list.classList.remove('visible');
}

function convertCurrency() {
    // Retrieve the selected currencies from the inputs
    const fromCurrency = document.getElementById('fromCurrencyInput').value.toUpperCase();
    const toCurrency = document.getElementById('toCurrencyInput').value.toUpperCase();
    const amount = document.getElementById('amountInput').value;

    const url = `/api/convert_currency?base_currency=${fromCurrency}&to_currency=${toCurrency}&amount=${amount}`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.rate) {
                const rate = data.rate;
                const convertedAmount = rate * amount;
                document.getElementById('exchangeRate').textContent = `${amount} ${fromCurrency} is equal to ${convertedAmount.toFixed(6)} ${toCurrency}`;
                document.getElementById('conversionText').textContent = `${fromCurrency} = ${rate.toFixed(6)} ${toCurrency}`;
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


function loadCurrencyData() {
    fetch('/api/historical_rates')
        .then(response => response.json())
        .then(data => {
            const labels = []; 
            const datasets = {};
            const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'black', 'gray'];
            console.log(data);
            for (const d of data){
                if (!datasets[d.from_currency]){
                    datasets[d.from_currency] = {}
                }
                const chart_dataset = datasets[d.from_currency];

                if(!chart_dataset[d.to_currency])
                {
                    chart_dataset[d.to_currency] = {
                        label: d.to_currency,
                        data: [],
                        fill: false,
                        borderWidth: 1,
                        borderColor: colors[chart_dataset.length]
                    };
                }
                chart_dataset[d.to_currency].data.push({
                    x: d.created_at,
                    y: d.rate
                });
            }

            CHARTS.forEach(chart => chart.destroy());
            const parent = document.getElementById('charts');
            for (const child of parent.children)
            {
                child.remove();
            }
            parent.innerHTML = '';
            CHARTS = Object.entries(datasets).map(([from_currency, chart_dataset]) =>{
                const chart_data = Array.from(Object.values(chart_dataset));
                const box = document.createElement('div');
                box.style = 'height:500px; width:500px;';
                const canvas = document.createElement('canvas');
                canvas.id = from_currency;
                canvas.height = '100px';
                canvas.width = '100px';
                box.appendChild(canvas);
                parent.appendChild(box);
                const ctx = canvas.getContext('2d');
                return new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: chart_data
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        scales: {
                            x: { 
                                type: 'time',
                                time: {
                                    unit: 'year'
                                },
                                title: {
                                    display: true,
                                    text: 'Year'
                                }
                            },
                            y: {
                                beginAtZero: false,
                                title: {
                                    display: true,
                                    text: 'Exchange Rate'
                                }
                            }
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        let label = context.dataset.label || '';
                                        if (label) {
                                            label += ': ';
                                        }
                                        if (context.parsed.y !== null) {
                                            label += new Intl.NumberFormat().format(context.parsed.y);
                                        }
                                        return label;
                                    }
                                }
                            },
                            title: {
                                display: from_currency === 'USD',
                                text: 'Historical Exchange Rates for USD',
                                position: 'top',
                                font: {
                                    size: 15, 
                                    weight: 'bold', 
                                    family: 'Arial' 
                                }
                            }
                        }
                    }
                
                });
            })
        })
        .catch(error => {
            console.error('Error loading chart data:', error);
        });
}



function randomColor() {
    // This function should return a random color for the datasets
    return `#${Math.floor(Math.random()*16777215).toString(16)}`;
}

document.addEventListener('DOMContentLoaded', function() {
    loadCurrencyData();
});




function clearFields() {
    document.getElementById('fromCurrencyInput').value = '';
    document.getElementById('toCurrencyInput').value = '';
    document.getElementById('amountInput').value = '';
    document.getElementById('exchangeRate').textContent = '-';
    document.getElementById('conversionText').textContent = 'Please enter values to see the converted currency';
}

//
//

