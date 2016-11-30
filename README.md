# Guicy MusicSearch
Music search kept separate until merged to katalog

`npm install`
`npm start`
visit http://localhost:3333


#Using Local ES Server

Connecting Searchkit to your local elasticsearch instance. If you are are getting a cors related error, you will need to add the following to you `config/elasticsearch.yml` file.  
You can find home diractory of elasticsearch by:  
`curl "localhost:9200/_nodes/settings?pretty=true"`

Add to config:  
`http.cors.enabled : true`  
`http.cors.allow-origin : "*"`  
`http.cors.allow-methods : OPTIONS, HEAD, GET, POST, PUT, DELETE`  
`http.cors.allow-headers : X-Requested-With,X-Auth-Token,Content-Type, Content-Length`  
