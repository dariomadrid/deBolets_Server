/* GET CACERES */
jQuery.get("http://localhost:3000/api/caceres?api_key=touch2", function (data, textStatus, jqXHR) {
    console.log("Post response:"); console.dir(data); console.log(textStatus); console.dir(jqXHR);
});
jQuery.get("/api/caceres/", function(data, textStatus, jqXHR) { console.dir(data); });
jQuery.get("/api/caceres/502ea56ae4b1607e1b000007", function(data, textStatus, jqXHR) { console.dir(data); });
jQuery.get("/api/caceres/502ea56ae4b1607e1b000007/500976b2b7b30e0000000017", function(data, textStatus, jqXHR) { console.dir(data); });

// desde: 500855a1ab94780000000007
// fins a: 500976b2b7b30e0000000017

/* CREAR CACERES */

jQuery.post("/api/caceres?api_key=touch2", {
  "id": "1928293-1",
  "nom": "Cacera XXXX1",
  "info": "Detalls i descripció de la meva cacera.",
  "logo": "http://localhost/DeBolets/api/public/resources/images/cacera_bolets.jpg",
  "datahora": "07/07/2012 02:00"
}, function (data, textStatus, jqXHR) {
    console.log("Post response:"); console.dir(data); console.log(textStatus); console.dir(jqXHR);
});
jQuery.post("/api/caceres?api_key=touch2", {
  "id": "1928293-2",
  "nom": "Cacera XXXX1",
  "info": "Detalls i descripció de la meva cacera.",
  "logocacera": "http://localhost/DeBolets/api/public/resources/images/cacera_bolets.jpg",
  "datahora": "07/07/2012 10:00"
}, function (data, textStatus, jqXHR) {
    console.log("Post response:"); console.dir(data); console.log(textStatus); console.dir(jqXHR);
});

jQuery.post("/api/caceres?api_key=touch2", {
  "id": "1928293-3",
  "nom": "Cacera XXXX1",
  "info": "Detalls i descripció de la meva cacera.",
  "logocacera": "http://localhost/DeBolets/api/public/resources/images/cacera_bolets.jpg",
  "datahora": "07/07/2011 02:00"
}, function (data, textStatus, jqXHR) {
    console.log("Post response:"); console.dir(data); console.log(textStatus); console.dir(jqXHR);
});


/*UPDATE CACERA*/
jQuery.ajax({
	url: "/api/caceres/5006e3e1ed41848fe600000d",
	type: "PUT",
	data: {
		"id": "1928293-1",
  		"nom": "Cacera XXXX1",
  		"info": "Cacera modificada!!",
  		"logo": "http://localhost/DeBolets/api/public/resources/images/cacera_bolets.jpg",
		"datahora": "07/07/2012 02:00"
	},
	success: function(data, textStatus, jqXHR) { 
	    console.log("PUT resposne:"); 
	    console.dir(data); 
	    console.log(textStatus); 
	    console.dir(jqXHR); 
	}
});

jQuery.ajax({
    url: "/api/products/4f34734d21289c1c28000007", 
    type: "PUT",
    data: {
      "title": "My Awesome T-shirt",  
      "description": "All about the details. Of course it's black, and longsleeve." 
    }, 
    success: function(data, textStatus, jqXHR) { 
        console.log("PUT resposne:"); 
        console.dir(data); 
        console.log(textStatus); 
        console.dir(jqXHR); 
    }
});

/*DELETE CACERA*/
jQuery.ajax({url: "http://localhost:3000/api/caceres/502ea56ae4b1607e1b000007", type: "DELETE", success: function(data, textStatus, jqXHR) { console.dir(data); }});
/*DELETE ALL CACERAS*/
jQuery.ajax({url: "http://localhost:3000/api/caceres/?api_key=touch2", type: "DELETE", success: function(data, textStatus, jqXHR) { console.dir(data); }});


/* Product Document 
[
{  
  "title": "My Awesome T-shirt",  
  "description": "All about the details. Of course it's black.",  
  "images": [  
    {  
      "kind": "thumbnail",  
      "url": "images/products/1234/main.jpg"  
    }  
  ],  
  "categories": [  
      { "name": "Clothes" },  
      { "name": "Shirts" }  
  ],  
  "style": "1234",  
  "variants": [  
    {  
      "color": "Black",  
      "images": [  
        {  
          "kind": "thumbnail",  
          "url": "images/products/1234/thumbnail.jpg"  
        },  
        {  
          "kind": "catalog",  
          "url": "images/products/1234/black.jpg"  
        }  
      ],  
      "sizes": [  
        {  
          "size": "S",  
          "available": 10,  
          "sku": "CAT-1234-Blk-S",  
          "price": 99.99  
        },  
        {  
          "size": "M",  
          "available": 7,  
          "sku": "CAT-1234-Blk-M",  
          "price": 109.99  
        }  
      ]  
    }  
  ],  
  "catalogs": [  
      { "name": "Apparel" }  
  ]  
}
]
*/