"use strict";
const pulumi = require("@pulumi/pulumi");
const aws = require("@pulumi/aws");
const myconfig = require('./myconfig')

let size = "t2.micro";
let ami  = "ami-0c5199d385b432989"; // AMI for Ubuntu Server 18.04 LTS

let group = new aws.ec2.SecurityGroup("ijtemaApp-secgrp", {
    ingress: [
        { protocol: "tcp", fromPort: 22, toPort: 22, cidrBlocks: ["0.0.0.0/0"] },
        { protocol: "tcp", fromPort: 9000, toPort: 9000, cidrBlocks: ["0.0.0.0/0"] },
    ],
    egress: [
        { protocol: "-1", fromPort: 0, toPort: 0, cidrBlocks: [ "0.0.0.0/0" ] },
    ]
});

let userData =
`#!/bin/bash
sudo -H -u ubuntu bash << EOF
{
pushd /home/ubuntu

sudo -H apt update
sudo -H apt install python build-essential mariadb-server mariadb-client -y

wget -O nodejs.deb https://deb.nodesource.com/node_8.x/pool/main/n/nodejs/nodejs_8.12.0-1nodesource1_amd64.deb
sudo -H dpkg -i nodejs.deb

sudo -H npm install -g gulp

git clone https://github.com/shaan1337/ijtemaApp-backend.git
pushd ijtemaApp-backend > /dev/null
npm install

#add config
cat >./server/firebase/config.js <<EOL
`
+ myconfig.firebaseConfig +
`
EOL

#add mariadb config
cat >/tmp/config.sql <<EOSQL
UPDATE mysql.user SET plugin = 'mysql_native_password' WHERE User = 'root';
FLUSH PRIVILEGES;
CREATE DATABASE ijtema;
EOSQL

sudo -H mysql -u root --password="" < /tmp/config.sql

gulp build

rm start.sh
echo export NODE_ENV=production >> start.sh
echo export PORT=9000 >> start.sh
echo node ./dist/server/app.js >> start.sh
chmod +x ./start.sh
screen -d -m ./start.sh
popd > /dev/null
} &> /home/ubuntu/setup.log`;

let server = new aws.ec2.Instance("ijtemaapp-backend", {
    instanceType: size,
    securityGroups: [ group.name ], // reference the security group resource above
    ami: ami,
    userData: userData,
    keyName: myconfig.keyPair,
});

exports.publicIp = server.publicIp;
exports.publicHostName = server.publicDns;