# API Standards for IE. Final Project

## Insert a new _form_ to database:

* **Request**:
    + `Post`
    + `/api/forms`
        ```json
        {
            "title": "First Form", 
            "fields":
            [
                {
                    "name": "First_Name" , 
                    "title": "First Name" , 
                    "type": "Text",
                    "required": true
                }, 
                {
                    "name": "Your_Location" , 
                    "title": "Your Location" , 
                    "type": "Location",
                    "required": false
                }, 
                {
                    "name": "Request_Type" , 
                    "title": "Request Type" , 
                    "type": "Text" , 
                    "options":
                    [
                        {"label" : "Help" , "value" : "Help"}, 
                        {"label" : "Info" , "value" : "Information"} 
                    ] 
                }, 
                {
                    "name": "Base_Location", 
                    "title": "Base Location", 
                    "type": "Location", 
                    "options":
                    [
                        {"label" : "Base1" , "value" : {"lat" : "1.2" , "long": "3.2"}}, 
                        {"label" : "Base2" , "value" : {"lat" : "2.3" , "long" : "1.434" }} 
                    ] 
                } 
            ] 
        }
        ```


* **Response** if form inserted:
    ```json
    {
        "status": "ok",
        "message": "'First Form' inserted successfuly.",
    }
    ```

* **Response** if form NOT inserted:
    ```json
    {
        "status": "error",
        "message": "Error message",
    }
    ```

## Retrive List of all _forms_:

* **Request**:
    + `GET`
    + `/api/forms`

* **Response**:
    ```json
    {
        "forms":
        [
            {
                "title":"First Form" , 
                "form_id": "1" , 
                "url": "/api/forms/1"                     
            },
            {
                "title":"Second Form" , 
                "form_id": "2" , 
                "url": "/api/forms/2"                     
            },
            .
            .
            .
        ] 
    }
    ```

## Retrive _form_ information by _id_:

* **Request**:
    + `GET`
    + `/api/forms/<FORM_ID>`

* **Response**:
    ```json
    {
        "title":"First Form" , 
        "form_id": 1, 
        "fields":
        [
            {
                "name":"First_Name" , 
                "title": "First Name" , 
                "type": "Text",
                "required": true
            }, 
            {
                "name": "Your_Location" , 
                "title": "Your Location" , 
                "type": "Location",
                "required": false
            }, 
            {
                "name": "Request_Type" , 
                "title": "Request Type" , 
                "type": "Text" , 
                "options":
                [
                    {"label" : "Help" , "value" : "Help"}, 
                    {"label" : "Info" , "value" : "Information"} 
                ] 
            } , 
            {
                "name":"Base_Location" , 
                "title" : "Base Location" , 
                "type" : "Location" , 
                "options":
                [
                    {"label" : "Base1" , "value" : {"lat" : "1.2" , "long": "3.2"}}, 
                    {"label" : "Base2" , "value" : {"lat" : "2.3" , "long" : "1.434" }} 
                ] 
            } 
        ] 
    }
    ```


## Submit a _form_:

* **Request**:
    + `POST`
    + `/api/forms/submit`
        ```json
        {
            "form_id": "1",
            "response":
            {
                "First_Name": "...",
                "Your_Location": {
                    "lat": "...",
                    "long": "...",
                },
                "Request_Type": "Information",
                "Base_Location": {
                    "lat" : "1.2" ,
                    "long": "3.2"
                },
                .
                .
                .
            }
        }
        ```

* **Response** if any error occuers: 
    + `400 Bad Request`
    ```json
    {
        "status": "error",
        "errors":
        [
            {
                "message": "Loc field is required."
            },
            {
                "message": "Date field must be a date"
            },
            .
            .
            .
        ] 
    }
    ```
    

* **Response** if form submitted:
    ```json
    {
        "status": "ok",
        "message": "First Form updated successfuly.",
    }
    ```


## Retrive list of all responses to a single _form_ (Contains only location fields)

* **Request**:
    + `GET`
    + `/api/forms/<FORM_ID>/responses`

* **Response**:
    ```json
    {
        "title": "First Form",
        "form_id": 1,
        "form_fields":
        [
            {
                "name": "Home", 
                "title": "Home", 
                "type": "Location", 
                "label": "Location Label"
            },
            .
            .
            .
        ],
        "responses":
        [
            {
                "response_id": 1,
                "fields":
                [
                    {
                        "name": "Home", 
                        "title": "Home", 
                        "type": "Location", 
                        "label": "Location Label",
                        "value":
                            {
                                "lat": "1.2",
                                "long": "3.2",
                            },
                    },
                    .
                    .
                    .
                ],                     
            },
            .
            .
            .
        ] 
    }
    ```


## Retrive details of a single _response_ to a single _form_ (Contains all fields)

* **Request**:
    + `GET`
    + `/api/forms/<FORM_ID>/responses/<RESPONSE_ID>`

* **Response**:
    ```json
        {
            "form_id": 1,
            "response_id": 1,
            "fields":
            [
                {
                    "name": "Home", 
                    "title": "Home", 
                    "type": "Location", 
                    "label": "Location Label",
                    "value":
                        {
                            "lat": "1.2",
                            "long": "3.2",
                        },
                },
                .
                .
                .
            ],          
        }
    ```


## Insert a new _polygon_ area to database:

* **Request**:
    + `PUT`
    + `/api/polygons/`
        ```json
        {
            "type": "Feature",
            "properties":
                {
                    "polygon_id": 1,
                    "name": "Tehran"
                },
            "geometry":
                {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [
                                53.514404296875,
                                34.59704151614417
                            ],
                            [
                                51.416015625,
                                34.854382885097905
                            ],
                            [
                                51.6851806640625,
                                33.82023008524739
                            ],
                            [
                                53.514404296875,
                                34.59704151614417
                            ]
                        ]
                    ]
                }
        }
        ```

* **Response** if polygon inserted:
    ```json
    {
        "status": "ok",
        "message": "'Tehran' inserted successfuly.",
    }
    ```

* **Response** if polygon NOT inserted:
    ```json
    {
        "status": "error",
        "message": "Error message",
    }
    ```

    [geojson.io](http://geojson.io/)
    

## Retrieve All _polygons_ area contains a _geo-location_ inside themeselves:

* **Request**:
    + `GET`
    + `/api/polygons/filter/?lat=<LATITUDE>&long=<LONGITUDE>`

* **Response** for filtered request:
    ```json
    {
        "polygons":
        [
            {
                "polygon_id": 1,
                "name": "Tehran",
            },
            .
            .
            .
        ]
    }
    ```

## Retrieve All _polygons_:

* **Request**:
    + `GET`
    + `/api/polygons/`

* **Response**:
    ```json
    {
        "polygons":
        [
            {
                "polygon_id": 1,
                "name": "Tehran",
            },
            .
            .
            .
        ]
    }
    ```


## Filter the _responses_ to a single _form_ by _polygon_ areas:

* **Request**:
    + `GET`
    + `/api/forms/<FORM_ID>/responses/filter/?field=<FIELD_NAME>&polygon_id=<POLYGON_ID>`


* **Response** for filtered request:
    ```json
    {
        "title": "First Form",
        "form_id": 1,
        "responses":
        [
            {
                "response_id": 1,
                "fields":
                [
                    {
                        "name": "Request_Type" , 
                        "title": "Request Type" , 
                        "type": "Text" , 
                        "value": "Submitted value by user",
                    },
                    .
                    .
                    .
                ]                     
            },
            .
            .
            .
        ] 
    }
    ```


## Filter the _responses_ to a single _form_ by custom field:

* **Request**:
    + `GET`
    + `/api/forms/<FORM_ID>/responses/filter/?field=<FIELD_NAME>&lt=<LOWER_BOUND>&gt=<UPPER_BOUND>&eq=<EXACT_VALUE>`

    - Numeric:
        ```
        /api/forms/1/responses/filter/?field=Age&eq=25
        /api/forms/1/responses/filter/?field=Age&gt=18
        /api/forms/1/responses/filter/?field=Age&lt=30
        /api/forms/1/responses/filter/?field=Age&lt=30&gt=18
        ```

    - Date:
        ```
        /api/forms/1/responses/filter/?field=Submit_Date&eq=2020-01-01
        /api/forms/1/responses/filter/?field=Submit_Date&lt=2020-02-30
        /api/forms/1/responses/filter/?field=Submit_Date&gt=2020-01-01
        /api/forms/1/responses/filter/?field=Submit_Date&lt=2020-02-30&gt=2020-01-01
        ```

    - String:
        ```
        /api/forms/1/responses/filter/?field=First_Name&eq=Ali
        ```

* **Response** for filtered request:
    ```json
    {
        "title": "First Form",
        "form_id": 1,
        "responses":
        [
            {
                "response_id": 1,
                "fields":
                [
                    {
                        "name": "Age" , 
                        "title": "Age" , 
                        "type": "Number" , 
                        "value": 23,
                    },
                    .
                    .
                    .
                ]                     
            },
            .
            .
            .
        ] 
    }
    ```

