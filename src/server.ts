import express, {Router, Response, Request} from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { filter } from 'bluebird';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage/", async (req: Request, res: Response) =>{
    let {image_url} = req.query;
    let isImageUrl = require('is-image-url');

    if(!image_url) {
      return res.status(400).send("image url is required");
    }
    if(!isImageUrl(image_url)) {
      return res.status(422).send("could not find the image in the url");
    }
  
    let abs_path = await filterImageFromURL(image_url);
    return res.status(200).sendFile(abs_path,function() {
      deleteLocalFiles([abs_path]);
    });
    
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();