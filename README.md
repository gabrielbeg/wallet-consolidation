
# Wallet Consolidator

I always wanted to create a project to showcase here in Github, but I've always struggled to come up with an idea that was not just a random meaningless code that would show my skills. In fact, I wanted to solve a real world problem while I do it.

## Where this idea come from?
### Background
My wife is an investment consultant that always have to work with multiple investment broker platforms, and for a long time I always saw her complaining about the reports numbers, she always struggled to understand how they achieved those numbers. In fact, some customers started asking how the reports got to those numbers because if felt a little off from the actual account balance.

### The problem

One day we decided to go through all the numbers because if felt that those numbers were off... And in fact they were... I mean, most broker platforms were using a method that was not showing the reality of an investor wallet. That was bad, broker platforms were just showing unreal profitability and assets scenarios to its customers, the real problem here is that Investment Consultants has to charge customers based on their Assets value. If those values were wrong, customers were not being properly charged.

### The Solution
We decided to do a research, study and find a formula that was a better one for the customers. This formula should take into account the Contributions and the withdraw the money from the wallet and show realistic numbers at the end. So she would insert all the customers investiments and operations during the period into an excel formula that would generate 

#### WAHP: Weighted Average Holding Period
This method of calculating a wallet profitability would take into account the exposure time of each individual investment like trust funds, stocks and etc during a specifc period. This would bring reality to customers, increasing her service quality and bringing confidence to customers.

### The Other Problem
Now we have the correct numbers, how do we show them? You can't just send an excel or tell the customers random numbers without giving confidence and authority to it. 

The idea was to create a report for these customers, showing their initial asset value, their operations, profitability and a comparison with a trusted benchmark.

## The Final Solution

After gathering all the requirements and with a goal, we realized that I have to develop a solution in only 3 days before my wife uses the solution to generate the reports she needed for the customers. 3 days seems a lot, but we both have full time jobs and two kids to take care of. 

### The Development process
With that in mind the idea was to create an MVP, we already had all the calculations on the excel file so we could just take these and create the report. 

Extracting the data from the Excel was fine, I have done this plenty of times but I have never used a PDF Creator with that could export React components(Only originated from pure html).

So I thought I could use it to generate a PDF with all the information and export to PDF so she could email the customers with that report attached(that turned out to be a nightmare with multiple css styling being uncompatible and having to adapt). I wish I used the one with pure HTML.

During the development I came up with the idea of creating a QRCode for payment since we would already be telling the customer the service fee. Here in Brazil we have a payment type called PIX. It's an instant wire transfer that you can use a key(like your phone number), a link or a QR Code and read it from your bank App to make payments. There's an option on the QRCode to insert the requested amount, so we could leverage this to ask for the exact amount.

Because of the QRCode I had to turn this code into a monorepo and make a simple api endpoint to generate it. But for that I had to take the code generation standards and apply them, like a CRC16 algorithm to validate the integrety of the data to generate a PIX string and turn it into a QRCode. I still have to improve security for this one(Currently it has no authentication since the front-end is password protected and the lambda function only accepts calls from the front-end origin). But since time was crucial we needed at least a working version.



### Current Features

- XLSX Information extraction
- Data summary: the front end will show a table with customers and few information to validate that the xlsx data was correctly imported.
- Report generation using react component that export it into a PDF file.
- PIX QRCode generation inside the report from the API with dynamic pricing.

### Infrastructure

This monorepo is designed to fully work on AWS. I'm currently using a lambda function for the QRCode generation. Amplify for the front-end hosting.

### TODO

- Work on the security side of the api
- Transfer the file mapping and all data treatment into the backend(Currently the xlsx info extraction is being done by the front-end). It's not wrong but a backend language deals with it better and follows the Single Responsability Principle from SOLID.
- Create a cloudformation file and github workflow file so I can automatically deploy new features.


## If you got this far, congratulations, I hope you liked it! 😀