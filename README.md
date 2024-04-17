# CurrencyAppProject
![image 1](https://github.com/CU-CSCI3308-Spring2024/Recitation-014-Team-02/assets/126728435/4453da8c-cc92-400a-929a-1b726fc73219)

## Application Description 
WorldWideWallet is an essential tool for accurate currency conversions. The application will provide an interface that offers real-time exchange of currency to help users make financial decisions. Users will have access to live exchange rates from around the globe, updated to provide the most current information. This application will prioritize user experience with personalized logins so users can easily store whatever currencies they want to easily access and view. 

Our application delivers a comprehensive financial tool that meets the needs of our users by focusing on occurrence and user-friendly design. Users are able to view their recent searches, view charts, and convert from one currency to another seamlessly. Our hope is to provide people with an elevated way to manage and view currencies around the world.

## Contributors 
Chloé Wolff de Grivel Perrigny, Kate Ehrnstrom, Daniel Folino, Carter Sammis, Yuliia Piguliak, Ethan Schrauf

## Technology Stack 
* Node.js
* Handlebars
* postgreSQL
* Express
* Axios
  
## Prerequisites to Run the Application
* Docker
* Currency Converter API

## How to Run Application Locally 
1. Create a free Currency Converter API
* Use [this link](https://currencyapi.com/) to get an API key
2. Get API key 
* Once you are registered, you'll be redirected to a page with your API key 
3. Create .env file 
* Within the ProjectSourceCode file, create an .env file as specified below: 
```python
# database credentials
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="pwd"
POSTGRES_DB="users_db"

# Node vars
SESSION_SECRET="super duper secret!"
API_KEY="<your currency converter API key>"
```
4. Run website
* Use 
```bash
docker compose up 
```
to run the website
* The website should now be running at [http://localhost:3000/](http://localhost:3000/)

## How to Run Tests
To run the test cases, run 
```bash
docker compose up 
```
in your local terminal, and the test cases should execute

## Link to Deployed Application 
* This application is not currently deployed 

