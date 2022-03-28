# Extract Logins from HeidiSQL's settings export

## !!! DO NOT RUN THIS ON A PUBLIC SERVER !!!
Just to be clear - if you run this like this on a public server, everyone can see all your passwords.


## How to use

### export the txt-file
In HeidiSQL go to "File > Export settings as File..."

### save exported file to project root
Put this exported file in the root of this project. Preferably named `heidisql_backup.txt`

### open project in browser
now open your browser and navigate to the root of this project.

For me:
``` 
http://localhost/test/heidisql
```
 
### result
Now all your passwords should be visible in a table like this:

Folder | Host | User | Password | Port
---|---|---|---|---
folder/subfolder/conn_name|127.0.0.1| root| 123456789| 3306
example/projectX|db1.example.com| u_12345| supersecurepassword1| 3306
example/projectY|db2.example.com| u_54321| 1drowssaperucesrepus| 3306

