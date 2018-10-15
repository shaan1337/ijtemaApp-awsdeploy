## Description
This script will deploy [ijtemaApp-backend](https://github.com/shaan1337/ijtemaApp-backend) to an AWS `t2.micro` instance  
After deployment, the UI will be available at: `http://<instance ip>:9000/`

## Prerequisites
- AWS CLI
- pulumi

## Deployment Guide to AWS
```bash
$ aws configure #set up your AWS Access Key ID, AWS Secret Key & region
$ cp myconfig.js.example myconfig.js #edit myconfig.js to add necessary configuration
$ pulumi update
```

## TODO
- Elastic IP configuration
- Generate random root mysql password

## All ijtemaApp projects
[ijtemaApp](https://github.com/shaan1337/ijtemaApp) - ionic mobile app  
[ijtemaApp-backend](https://github.com/shaan1337/ijtemaApp-backend) - backend to ijtemaApp  
[ijtemaApp-awsdeploy](https://github.com/shaan1337/ijtemaApp-awsdeploy) - deployment script to deploy ijtemaApp-backend to AWS  