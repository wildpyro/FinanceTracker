# FinanceTracker
---
Tracks your stock portfolio through a transaction history. Built out of the desire to be able to run longer term statistics on my stock portfolio and do more in-depth trade analysis

## Features 
---
1. Monthly archiving 
2. Emailed position update (manual and scheuled)
3. A delayed datafeed from yahoo finanace api 
4. querying of historical financial data. 
5. Net worth calculators 

## Getting Started

Clone or download the repo.  

## Known Limitations

Presently this supports file uploads from ITrade and tangerine. 

### Prerequisites

Have node installed 

```
sudo apt-get install nodejs
```

Have mongo installed 
* See [Mongo manuals](https://docs.mongodb.com/manual/administration/install-community/) for more information out platform specific installations 

### Configuring

The app is generically configured out of the box for dev mode. 

Each config resides under 
```
config\env
```

### Installing

To run in dev 

```
cwd://grunt 
```

## Running the tests

There are presently no tests available

## Deployment



## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

Presently I don't make use of versioning.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
