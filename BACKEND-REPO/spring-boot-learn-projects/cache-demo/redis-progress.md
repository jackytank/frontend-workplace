# Cáchê

# **Overview**

- [x]  Enroll in the Redis Certified Developer Program
- [ ]  Complete the following courses at Redis University:
    - [ ]  RU101: Introduction to Redis Data Structures
    - [ ]  RU202: Redis Streams
    - [ ]  RU203: Querying, Indexing, and Full-Text Search (or any other elective course)
- [ ]  Review the study guide and take the practice test
- [ ]  Schedule and take the Redis Certified Developer Exam
- [ ]  Receive your digital badge and certificate

# Detail

### Query

- Small exercise (Convert SQL to Redis Query)
    1. **SELECT * FROM bicycles WHERE price >= 1000**
        
        ```jsx
        ft.search itemIdx '@price:[1000 +inf]'
        ```
        
    2. **SELECT id, price FROM bicycles**
        
        ```jsx
        ft.search itemIdx '*' return 2 __key $.price
        ```
        
    3. **SELECT id, price-price*0.1 AS discounted FROM bicycles**
        
        ```jsx
        FT.AGGREGATE itemIdx '*' LOAD 2 __key $.price APPLY '@price-@price*0.10' AS discounted
        ```
        
    4. **SELECT condition, AVG(price) AS avg_price FROM bicycles GROUP BY condition**
        
        ```jsx
        FT.AGGREGATE itemIdx '*' GROUPBY 1 @condition REDUCE AVG 1 @price AS avg_price
        ```
        
    
- Exact match
    - Numeric field
        - Perform exact price 270
        
        ```jsx
        FT.SEARCH itemIdx '@price:[270 270]'
        FT.SEARCH itemIdx '*' FILTER price 270 270
        ```
        
    - Tag field
        - query for new bicycle
        
        ```jsx
        FT.SEARCH itemIdx '@condition:{new}'
        ```
        
    - Full-text field
        - finding all bicycles that have a description containing the exact text 'rough terrain’
        
        ```jsx
        FT.SEARCH itemIdx '@description:"rough terrain"'
        ```
        
- Range
    - Range queries
        - Finds bicycles within a price range greater than or equal to 500 USD and smaller than or equal to 1000 USD (**`500 <= price <= 1000`**):
        
        ```jsx
        FT.SEARCH itemIdx '@price:[500 1000]'
        FT.SEARCH itemIdx '*' FILTER price 500 1000
        ```
        
        - bicycles with a price greater than 1000 USD (**`price > 1000`**)
        
        ```jsx
        // use [(1000 +inf] instead [1000 +inf] becuz '(' exclude 1000 from range
        FT.SEARCH itemIdx '@price:[(1000 +inf]'
        ```
        
        - bicycles with a price lower than or equal to 2000 USD (**`price <= 2000`**) by returning the five cheapest bikes:
        
        ```jsx
        FT.CREATE bikeIndex ON JSON PREFIX 1 bike: SCHEMA $.name AS name TEXT 
        SORTABLE $.price AS price NUMERIC $.color AS color TAG SORTABLE $.brand 
        AS brand TEXT SORTABLE
        
        FT.SEARCH bikeIndex '@price:[-inf 2000]' SORTBY price ASC LIMIT 0 5
        
        ```
        
- Full text
    - Single word
        - all bicycles that have the word 'kids' in the description:
        
        ```jsx
        FT.SEARCH itemIdx '@description: kids'
        ```
        
    - Word prefix (start with)
        - bicycles with a brand that starts with 'ka':
        
        ```jsx
        FT.SEARCH itemIdx '@model: ka*'
        ```
        
    - Word suffix (end with)
        - finds all brands that end with 'bikes':
        
        ```jsx
        FT.SEARCH itemIdx '@model: *bikes'
        ```
        
    - Fuzzy search (like SQL LIKE)
        - all documents that contain a word that has a distance of one to the incorrectly spelled word 'optamized’
            - You can see word ‘optamized’ is misspelled but its OK because we fuzzy search of %%, if u want to have most 2 incorrect 2 letters, use %%%%
        
        ```jsx
        FT.SEARCH idx:bicycle "%optamized%"
        FT.SEARCH idx:bicycle "%%optamised%%"
        ```
        
- Combined
    - AND
        - query that finds bicycles in new condition and in a price range from 500 USD to 1000 USD:
        
        ```jsx
        FT.SEARCH myidx '@price:[500 1000] @condition:{new}'
        FT.SEARCH myidx 'kids (@price:[500 1000] @condition:{used})'
        ```
        
    - OR
        
        ```jsx
        FT.SEARCH idx:bicycle "@description:(kids | small) @condition:{new | used}"
        ```
        
    - NOT
        - exclude new bicycles from the search within the previous price range
        
        ```jsx
        FT.SEARCH myidx '@price:[500 1000] -@condition:{new}'
        ```
        
- Aggregation
    - Simple mapping
        - how to calculate a discounted price for new bicycles:
        
        ```jsx
        FT.AGGREGATE myIdx '@condition:{price}' LOAD 2 '__key' 'price' APPLY '@price - (@price * 0.1)' AS 'discounted'
        ```
        
    - Grouping with aggregation
        - how to group by the field **`condition`** and apply a reduction based on the previously derived **`price_category`**. The expression **`@price<1000`** causes a bicycle to have the price category **`1`** if its price is lower than 1000 USD. Otherwise, it has the price category **`0`**. The output is the number of affordable bicycles grouped by price category.
        
        ```jsx
        FT.AGGREGATE myIdx '*' LOAD 1 price APPLY '@price<1000' AS price_category GROUPBY 1 @condition REDUCE SUM 1 '@price_category' AS 'num_affordable'  
        ```
        
    - Aggregating without grouping
        - adds a type attribute **`bicycle`** to each document before counting all documents with that type:
        
        ```jsx
        FT.AGGREGATE myIdx '*' APPLY "'bicycle'" AS type GROUPBY 1 @type REDUCE COUNT 0 AS num_total
        ```
        
    - Grouping without aggregation
        - how to group all bicycles by **`condition`**:
        
        ```jsx
        FT.AGGREGATE myIdx '*' LOAD 1 '__key' GROUPBY 1 '@condition' REDUCE TOLIST 1 '__key' AS bicycles 
        ```
        

### JSON

- Example
    - Simple example
    
    ```jsx
    > JSON.SET animal $ '"dog"'
    "OK"
    > JSON.GET animal $
    "[\"dog\"]"
    > JSON.TYPE animal $
    1) "string"
    
    > JSON.STRLEN animal $
    1) "3"
    > JSON.STRAPPEND animal $ '" (Canis familiaris)"'
    1) "22"
    > JSON.GET animal $
    "[\"dog (Canis familiaris)\"]"
    
    > JSON.SET num $ 0
    OK
    > JSON.NUMINCRBY num $ 1
    "[1]"
    > JSON.NUMINCRBY num $ 1.5
    "[2.5]"
    > JSON.NUMINCRBY num $ -0.75
    "[1.75]"
    > JSON.NUMMULTBY num $ 24
    "[42]"
    
    > JSON.SET example $ '[ true, { "answer": 42 }, null ]'
    OK
    > JSON.GET example $
    "[[true,{\"answer\":42},null]]"
    > JSON.GET example $[1].answer
    "[42]"
    > JSON.DEL example $[-1]
    (integer) 1
    > JSON.GET example $
    "[[true,{\"answer\":42}]]"
    
    > JSON.SET arr $ []
    OK
    > JSON.ARRAPPEND arr $ 0
    1) (integer) 1
    > JSON.GET arr $
    "[[0]]"
    > JSON.ARRINSERT arr $ 0 -2 -1
    1) (integer) 3
    > JSON.GET arr $
    "[[-2,-1,0]]"
    > JSON.ARRTRIM arr $ 1 1
    1) (integer) 1
    > JSON.GET arr $
    "[[-1]]"
    > JSON.ARRPOP arr $
    1) "-1"
    > JSON.ARRPOP arr $
    1) (nil)
    
    > JSON.SET obj $ '{"name":"Leonard Cohen","lastSeen":1478476800,"loggedOut": true}'
    OK
    > JSON.OBJLEN obj $
    1) (integer) 3
    > JSON.OBJKEYS obj $
    1) 1) "name"
       2) "lastSeen"
       3) "loggedOut"
    ```
    
- Path/JSONPath
    - JSONPath Official Example
        
        ```json
        {
          "store": {
            "book": [
              {
                "category": "Reference",
                "author": "Nigel Rees",
                "title": "Sayings of the Century",
                "price": 8.95
              },
              {
                "category": "fiction",
                "author": "Evelyn Waugh",
                "title": "Sword of Honour",
                "price": 12.99
              },
              {
                "category": "fiction",
                "author": "Herman Melville",
                "title": "Moby Dick",
                "isbn": "0-553-21311-3",
                "price": 8.99
              },
              {
                "category": "fiction",
                "author": "J. R. R. Tolkien",
                "title": "The Lord of the Rings",
                "isbn": "0-395-19395-8",
                "price": 22.99
              }
            ],
            "bicycle": {
              "color": "red",
              "price": 19.95
            }
          },
          "blog": [
            {
              "author": "jt"
            }
          ]
        }
        ```
        
        ```jsx
        // the authors of all books in the store
        $.store.book[*].author
        // all authors
        $..author
        // all things in store, which are some books and a red bicycle.
        $.store.*
        // the price of everything in the store.
        $.store..price
        // the third book
        $.store.book[2]
        // the last book in order.
        $.store.book[(@.length-1)]
        $.store.book[-1:]
        // the first two books
        $.store.book[0,1]
        $.store.book[:2]
        // filter all books cheapier than 10
        $.store.book[?(@.price<10)]
        // all Elements in XML document. All members of JSON structure.
        $..*
        ```
        
    - Redis JSONPath Example
        - Demo data
            
            ```jsx
            JSON.SET store $ '{"inventory":{"headphones":[{"id":12345,"name":"Noise-cancelling Bluetooth headphones","description":"Wireless Bluetooth headphones with noise-cancelling technology","wireless":true,"connection":"Bluetooth","price":99.98,"stock":25,"free-shipping":false,"colors":["black","silver"]},{"id":12346,"name":"Wireless earbuds","description":"Wireless Bluetooth in-ear headphones","wireless":true,"connection":"Bluetooth","price":64.99,"stock":17,"free-shipping":false,"colors":["black","white"]},{"id":12347,"name":"Mic headset","description":"Headset with built-in microphone","wireless":false,"connection":"USB","price":35.01,"stock":28,"free-shipping":false}],"keyboards":[{"id":22345,"name":"Wireless keyboard","description":"Wireless Bluetooth keyboard","wireless":true,"connection":"Bluetooth","price":44.99,"stock":23,"free-shipping":false,"colors":["black","silver"]},{"id":22346,"name":"USB-C keyboard","description":"Wired USB-C keyboard","wireless":false,"connection":"USB-C","price":29.99,"stock":30,"free-shipping":false}]}}'
            ```
            
            Look like this in the JSON
            
            ```json
            {
               "inventory": {
                  "headphones": [
                     {
                        "id": 12345,
                        "name": "Noise-cancelling Bluetooth headphones",
                        "description": "Wireless Bluetooth headphones with noise-cancelling technology",
                        "wireless": true,
                        "connection": "Bluetooth",
                        "price": 99.98,
                        "stock": 25,
                        "free-shipping": false,
                        "colors": ["black", "silver"]
                     },
                     {
                        "id": 12346,
                        "name": "Wireless earbuds",
                        "description": "Wireless Bluetooth in-ear headphones",
                        "wireless": true,
                        "connection": "Bluetooth",
                        "price": 64.99,
                        "stock": 17,
                        "free-shipping": false,
                        "colors": ["black", "white"]
                     },
                     {
                        "id": 12347,
                        "name": "Mic headset",
                        "description": "Headset with built-in microphone",
                        "wireless": false,
                        "connection": "USB",
                        "price": 35.01,
                        "stock": 28,
                        "free-shipping": false
                     }
                  ],
                  "keyboards": [
                     {
                        "id": 22345,
                        "name": "Wireless keyboard",
                        "description": "Wireless Bluetooth keyboard",
                        "wireless": true,
                        "connection": "Bluetooth",
                        "price": 44.99,
                        "stock": 23,
                        "free-shipping": false,
                        "colors": ["black", "silver"]
                     },
                     {
                        "id": 22346,
                        "name": "USB-C keyboard",
                        "description": "Wired USB-C keyboard",
                        "wireless": false,
                        "connection": "USB-C",
                        "price": 29.99,
                        "stock": 30,
                        "free-shipping": false
                     }
                  ]
               }
            }
            ```
            
            - Query with JSONPath in Redis
            
            ```jsx
            // Use the wildcard operator * to return a list of all items 
            // in the inventory
            JSON.GET store $.inventory.*
            // The following paths return the names of all headphones
            JSON.GET store $.inventory.headphones[*].name
            JSON.GET store $.inventory["headphones"][*].name
            JSON.GET store $..headphones[*].name
            // This example returns the names of the first two headphones
            JSON.GET store $..headphones[0:2].name
            // Filter only returns wireless headphones with a price of less than 70
            JSON.GET store $..headphones[?(@.price<70&&@.wireless==true)]
            // filters inventory for the names of items that support Bluetooth
            JSON.GET store $.inventory.*[?(@.connection=="Bluetooth")].name
            ```
            
            - Update JSON examples
            
            ```jsx
            127.0.0.1:6379> JSON.GET store $..headphones[0].price
            "[99.98]"
            127.0.0.1:6379> JSON.SET store $..headphones[0].price 78.99
            "OK"
            127.0.0.1:6379> JSON.GET store $..headphones[0].price
            "[78.99]"
            ```
            
            ```jsx
            // changes free-shipping to true for any items with a price 
            // greater than 49
            
            ```