var express = require('express'),
  app = express(),
  multer = require('multer'),
  port = process.env.PORT || 3000,
  bodyParser = require('body-parser');
var upload = multer({ dest: 'uploads/' });

var util = require('util');
var mime = require('mime');


/**set up body parsing */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/imageSearchRoutes'); //importing route
routes(app); //register the route

// Set up auth
var config = {
  keyFilename: 'ImageSearchAPISecret.json'
};

// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');

// Creates a client
// const client = new vision.ImageAnnotatorClient();
const client = new vision.ImageAnnotatorClient(config);

// var visionClient  = vision({
//   keyFilename: 'secret.json',
//   projectId: 'mercurial-shape-199816'
// });
var HttpsProxyAgent = require('https-proxy-agent');
var request = require('request');
var proxy = 'http://proxy.tcs.com:8080';
var agent = new HttpsProxyAgent(proxy);
var fs = require('fs');

var fs = require('fs');
var imageFile = fs.readFileSync('./assets/Webp.net-compress-image.jpg');

// Covert the image data to a Buffer and base64 encode it.
var encoded = new Buffer(imageFile).toString('base64');

var postData = {
  "requests": [
      {
          "image": {
              "content": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxASEBISEhIVFRUSFQ8QFRUWFRISFRUQFRUWFhUSFRUYHSggGBolGxUVITEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0OFxAQGi0fHR0rLS0tKy0tLSsrKy0tLS03LS0rKy0tKystLS0rLS0rKysrLS0tLSstLSstLS0rLSstLf/AABEIALcBEwMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAADBAABAgUGB//EAEgQAAEDAQQGBgYGCAMJAAAAAAEAAgMRBBIhMQVBUWFxgRMikaGxwQYUMlKS0RVCU9Lh8CNUYnKCk6LxQ7LiFiQzY3OjwsPT/8QAGQEBAQEBAQEAAAAAAAAAAAAAAQACAwQF/8QAIREBAQEBAAIDAQADAQAAAAAAAAERAhIxAyFRQSJhcSP/2gAMAwEAAhEDEQA/AFLHDRdizxbEKzQLqwQ0xXrrhEZDgiNYilpW2BETLGIrYltjEw1qtTETEVoWmhaDUNIwIgVMaiUQUCuqpRBZJVVWlQCQqikUdXAbSrRrEP0je1FuRK0jZOjdQZHI79Y/O1JOK9RbIBIwt15g/tal5pzM6o4uxdTA6qwroFq8thAFHShLyS1S8j6J8Ro8k51USpeSc1bTVFa1azAx0ZK21hCOX0+qsOnGxG1MEoTncFJJTwSb3EJkFrUuaw5mCy0nMlGYAc1oEZo6LnWloXXnaMda5szapjNceaJKuhC60lnQ3WdIccxqLpGDcostPQ2SJdaKNZsln1p66AuVrpIw6HBZEabjbULXRolNhcNRAEQxqw1OjA2ozVBGtCMoLTQtXVTQUUIaDLVVEUrJUAysohKG4pgZJTGjhV/I+ICVqntEjF2673n8EdejPbtMXG07DR7XAe17XEbOOHYuy1yW0jHejO7rdmfdVcublbvp54NQ3hNGgCXLSu8cgnNCE5jdhTBYFh60KGxwGpR0xyVELXR11JAZcSsuwTLYViRgVqJkoD21KeLQsUGxalFhdjVvoztWnLQBUoVfZ96XdZgV0xZa5rbbKAjcWa5PqgCE+zV1LsSQ7kB8aNOOObOouibOojVjq2dNXEtZ3BOxLnW40wUW6KOYoFFYaiXFTAihqCxcWg1buqKQZaqIRqLDmKRdxWTVHcxYupZoYCwSjFqgYlFyE5oyBoc6U1qBcGOAGZw7EO6E7YGi6dhPkFnv0efZuOQk5H8/gUcrz1otD3zFjb4Y2ocGEBwAvMfVoxccY3bmuBA29jR9ndHE1jnVIvVPEk0G4VpkMljrnJp5622OLaG3XFuwkctSXLl09MWclwcNYoeI/DwSUcC6836Ysul6E6lowph7diySnRgTYQFokK7pVhh2K0hPqVgQbSmOiK22BWrCwiCHIwJ/1cKCAbFeSxz2xblsWddBsal1XkfEq2Gmpb6NHDVCs6cLOhQZIxsTjklaOKoC5AUQSVa1gFhj3J2NZjiTLYUWmQaI1G9QNWoM0xdCxa0XaEdrVfRooajTgV1WGIlFKI1MliwQiKilAOCw5MXFRYnRYTLllzq5JwwjYstsydgwtHGTmujYm0b2lXPCG3RsFTxOaJCMB+dqz1da5gzIxWtBXbQV1a+Q7Fb3AYk+SDLNdIyAOJJrqzCXcHUdeNAMbzsBhUHHVUa1nCLauu1zRgWkGtOevckQzBZOloY3MAJeHiJt9t0s6zi1hrXEkgjCuSbeyhIW5LGdlKGJUIgmisFOjAboWSNyMVqOMq1YCxm5EDCmOiViNGmQEMV3UUtVFGkEtWCxFJWahKDuqiEQrLnBQLyNSU7E5PKAubaLYBrC3zKxbFiMKJB1vG1Rb8az5R6CMJmNqVgCZa5cLXaQYMWwEPpBqV30Iw0LVEsyVHDkUrVELQClFag3NVNaj3VYarUEGrVxEoopMUWomVPeroixCikDam9YcPMqmhElrXKuAwyPFDYaiu1BL6TMgie6JrXSNaXMDq0vbMOa82HTWp7gA50c7A9jyZLjGloexwHsXmyNAIxcanUvXKmtAFAAAMgBQdi3x34/xz748ruuHZ9BEw9HM91C57yxjqto+hLXOIq7rXnVAB6xC7T2rayUdd3r21OJz6CuKujCoOJWlJLoULwFlzggveEyLRjOFg2kJV5QyDsWvFnypz1kHJYdIlSSgyTAZlanDN6NucNZWDO0LlT28DIVSE1qkduXSfFa59fNI7s2kmNz8VzrRpoaly+gcc1PVRt7l0nx8z25X5er6VPpBzlz5piV0xZgcmuPcl5oiDS7RdJ4uV8r7csk/kq030B2KlrYzle3bGmGMpqUjajsavmWvqBXt3ciMJOYRQFoBBYDUVgVgLQVqQBaVKIK6qiroopLAVgKqq6qSwi1Q2LSEy8oEWS3M+leCpmXilLUqslXVSRRW0b6KlAvO6h44qqlEtGVdnggVC3PTN9o6iG4gKpJ2DNwSctvbqW5zaxe5DJk2BBllO0JN1uOoc0BzpH4HuwXWfH+uV+Wfxu0WvekJZydS6LNGV1ov0ZRbnXMc7z304wa47AjxWKuZK6XqRGQRbhaq/J+Ln4v0pHo0Ba9UAW5JqZlKutQG1Z/yre8ww5tBglJbuZVSWxJTEuyFeVVrnljr5J/FPlbXLwUSphf7p7FF08Z+ufn1+PbNeExG4JFkZ3IgjO7tK+fj6LoXmDWo1w2rn+r1+qeNUVlnI/ugngVAUFhW6oIlVqqGCpVSELlReguVMtDBgfxSBunAzU9fjpqQqtORqqbEwkYCvBWLTjDhxxV1WSVbQsktbTQHgi47u8JfSRo3u3ZjNGLht8EhKqArDjtUBUm1Asgq1JbhUEbcFxJGGtC44YUqu0kdIYEYZ413rp8fWVz+SfWl47DGcXE8FqSCOtA0Jfoydvetsse/vK3d/tYnj/I26ztGXksggHJE9Up9ZW1rG66qlVk/wCLaApK6ijrU0ZBMWeIOxfkRUAHxKL9fdM+/qEH2qgwFeKVmtDzuTlsszb3VDgN/klnwkZrpzeXPudkXAlZEO1PhiotXTycfAB78KBoAG5BDy0UFfxTbYi40aKkpuTRDbntdc40wujdVYvXM9uvM6vpw3SmuZ7VE47RMtfZHxBRW8fq/wDT8dSN7TkfEIgNUnDNvpyqmo3HMmu/JeZ6hw2qj4ydZCHfbt7FoP3ntQhWCi1VYa4KjJ+cVIUOVtdXAUQM1YpuUhngjWO1DJ4qXOHarKQnSMpSh70SyEE1Ayw5oYBOSPCKDvR9GfYpKlVlUShorpU9UcaJu+KauxJaVBoymV8V4UPnRMF4wFXVIrQcO9I1RKgKzXceyqoyUzw5hQ0UFWl/WG7UVpriComWNohWyK83DMYojHbVsjBG5VZsxxS1yoglFmFHUJyw4LLgBkSuvk5eGMhjtRruzIWTEBmcdmtaJFcC5YKpRYxhs81ZnkrgQOVUQM3+ajroy/PBWxSWegC95zd2CiqiLgoVqWQWdUIRk5CqL6rT26t2YVUZOW5UH54qOnJzqdexF6pnE/oRlLahhGOsgpZ08vvDHZWqbNqApRg54oElrdqA7NXastfX8DvuOb+9RKunOzwVJwb/ALc2HS1p/VTrykZXhlxTMGmLQT1rJIBtD4natYqMaqoJBtCcicFnWsZj0vJh/usw5xffxzVv0vKDQWSY76xU/wA6Za6mrxRWlWrCEemZtdknH8p2r97ajfTD/wBVtHwx8PfTtd1VK8uxWnC7dKHH9BOKfsNx4dZV9Kn7Cf8Alt+8m2uUv8FasKfTGQ6C0fyx95X9Nf8AJtH8r8Ud0w1qumHHsVoxmHS95zWiKfrFramOgFTrJOW9PW62Pa66GvIw9ltdS1o2K86uwHK7WvCqebZpMsaDbSvNGtYHYJHOYCQ4HH2hQpgKgCM6ciK9gQ5LS1uZpxQtC0y8MivbHxY0rm4DzUba4DSspBAG35LmekOlb0YjjqwucwmSgN0McDgDnXfvSzZ2532gcR4JkF6diSaFxp04JArSprQ60K7FqkacxgScRmuY21Nc2rTVpxvZ1BFeWCTtekRZgB6uXMddp0fUuvc4gEggADLGvLWi3DzL07Nqt9nhYXve1jW5ucaAV2lL2D0lskwJhlEoabpMYc8A7Kgb15r0ztTmxNjbnI4tcKVrGB1uVaLyNitfqpuil2Uta8UAB34awK4rvx8F6mxx7+acfVfW/puMZMlPAELbNPCuEcgG0nZjszXGkkNcOOW1UHu1+H4rHg1510rVpVrrzgyTUA2jAdms45d6WbpIEgFkgwrj0dBnn1tySL1Twdo70zmDyN/Sx+xk7YvvrA0s/VC74ovmkrzhv4LLpMaEU7QtTlm9V0DpaQ/4RpvkYPBYOkJdUI5yDyCV6TUHNP541RG1yJAG7HzVkU6q5NI2gZQs/mn7qzBpSfrX42AXXUuuc436YVqBhtWZpGjqlw5nHuSrruYIJ3kk+KZyOurBHaTtZ+rDr+1K3JpCbof8MS3ql11xjuUypeqDrSkp3t5mnkhkECouj4T5rXjGPOo622s5yRAbRGfNyE+0Ws5zM5Rf6lgvrrB4gDvqgykUxuji0Y/1qvMU6qjbLT9sz+V/qUQDI39gfD99RGNbXXjlIpUu7fkCnW1OTndq5MVtPuv7APNPxzE6vFed3hxrR73acfFNRs3u7SUgHE4YjgPwTEIPvnu+Si6DcNZK0KpbGntU5BAkgvZvdyc4eBUXQvH81Ua7HV5pKOAD6zviJRu0qRhzt6yDxSkswGpx4IHrwOBZIP4SR3KDoysc5jrhLXi6WnDDHFasOkbUARLdfS7Q0IPs9bEHaDtzXODPrRkh1CAXXyBXa0kVXDtHpBJHIWF0DiDQ0kMbq7muBHei1qV7aS2xPFJI3jex5+YKVNkshylmYd7n+YIXmoPSUjFzH8ujk7LhJ7l0IfS6z4XyG/vtMf8AmAROrGbxK67dGQEgGVsraEXXOGJO3EavFOMhjYbrYW9br5XhhRopmK9UJGz6ascmFY3cHMd4FOx+qnJg5VHmtz5P9MX4d9UvpEXYnBscjLoNCy+XY4ZVF7PIlcXR1jtLY2i0NcXBt193FrjrNRmDsovVNhh1F44PePNa9XbqllH8bljvqX1HT4+bz9W6+S+kukrS+W0MfE9zYcWHon9YENF0GmOI71yXRxBtnLmODnFrnNo/AUJpQ88ar7gbPsnk+IHxWDZnarQ/mGHyVx1ebcvtruTqSZ6fPYPSVjnGhfdw6vq0gPxFx8E39KCmT88+jc0U7O9e26OT9Zd8MfyWHNfrtL/hjHgFXrq+qJxzP481Y4Z5gHMBumtHZDv8kc6MtQzoOJbTlku06uu1P/o+SBLO0Z2t/a1anX6xefxx5tHSi6XgGr2tzZXEE4XnAZDakZAWkgMaCDsoRxxpVeggtLHzwt6R0ovOqHkkA3HUwyquV6RymK0PbUAO67am7g7Ggw21XTjr7xjvn60m+WTWwcsf/FXHaZBg2JvNrx30SUmlKCjQXHcK9+AW2Wueg1V/Zr5ldHIxLaH/AF2wciR5ILLd+4P4moL5J/rUp/0x5lZEz6e3TdcAomDob1sHIs5OB8liaR1MbtOLaeCwZXba/wADfkgyWyShAqNtGfJq2xjL5zX2gOUR/FDm6cjAxkcGhJ2yeU5TEcY6+SS9Yl1zNP8AA0LNajo0tXus/oUXKMkn2h7D91RDTvRaQZ9o3mjjTEIzk7AXeS8TZdHzbQOK69mskmuh34jwXndo9LHp6LKruPRvp4J+HSke3uK89ZrA44kjvJXSs9j/AGz2BR12YrY12RR68EhEymuvEhbcTsbzJKGjrZRtC2SD/dcsuftA4BZMMp/xSODfmpOkQN/aVYOxc5gIzc88boRukOzvSMZ0289C4VOOGZGGvEYhfP7ZZ2nMNcNho7xNV7G3Wa8RhIal2DXupjTDPu3oPqsIALg5oNfaew41x1VWLNLxDtHsLuq4NwGBdSgGzZyXQstkaBhO7MDCZ3zovROZZgatIOyuI4EEYrJe1uN0HYA0+FCjxGuNJY5Mf0zXDDBzYZCR/G2pRILDOBVrGHeI2R0G2rSPFdqQPexhaJInYGovDq1xaQBQ1G3Kq6NlEwvUIIqCL7wSN2JVh15I6Se04B4zpSW1A8LolT8ekrVQXJnYgUDZ5CeYeSV2rS+RzrpYKZf8WG9yF1c21+it4ki/UEEVdG0EDZqPPYpTb/WG6W0gML8hzx6Vp8Yitv0npDH9OcNskGP/AGN6pvo6QDQzA6qubQbqtk8kn/s5bK4vN3MjrV7Q8+Cotoc2nNI6pHHg6zn/ANKTtOm9Jj6zzqw9XPhGuydEPjbW/ITnS64g7qlqroAQCAOdQRuIBwKZBryNr9IdJA0Jf2Q//Nc2X0i0h7z/AIYvur2s9ldsJAFPqmg2UXJna4GnRVrhU0B7E+NZ8gPQvSVpktIMznEMcylRkTeB9kCi+h+kNqvtYGylrmCgoMwfqurnxK8XosPa8OuujO0AEeS709pa45g8eqtc83y+x11/iUdLaPtXdgKjrRPnfr2fJNernUO2hHIhA6cAkFuW6leFV2cgH2mTWXfC1yy60OpiRzj/AAW32yuQu7zcI8UvNKKVvXuTPvJiq3Tb29lPBZMjhk6nCuXNBExObQRnm0HsqqcBj1XDkD4JZW61u1yHtwSz7aPfB5g+aqXq/WA7Uo+QGuR7UUwc28/af0sUSBkZ7vj8lENurFO6o6x7Ano5n6n92Kii4OySWsjN7jwAHmsG2yj2R2uVqJChbrV74HBdCy260a3V5NUUSHQjmtRyLByCMIrQc5AOAUUWSKIdr3HmQs3f3viUUUYHaZbrSaVpvQTprrAtbUXZKCgArgWgg1GGONNaiiKWPpSzEAltHEVdQGl73RsxJFcurvW36WaHvq1tx5vNF0ZFr8yMQKmOoGoFRRCD0hpSB8TmtFBiaEOzAkxcQfYJLMutSqI3TMNb9QxpcHtPRh19hc69HQ1u1bcHI44qKJntVl2kY3AOjAxpVt0GhEZbdJfgeuAajYko9PsugGSjroBIaSxpDJBUC7Um85pNQRUYHUIoqrkW06ajbGHVIxe11BcJJbhIA3fjS9hXJKWX0zhkkab7ySXvMdwGpeW32B7smsAkAx1b1FFqSM22OvZNOxANHSuNAWjqkDBpa5zgQ6tXCoxOBpQUWZdNMIaCWVDXNJ6LAOpRr7pB15551FclaipzFegYtLsbjhJRvsdG0DpQSTIXVFWu2UwvjAXUnb9IxPDbrXBoBaDRmNHOo5w20I7aalFESmh2eNzy1rKAuNBgAj2nRszMCBXXiO1WounPTl1PoBjZmjAHk4BU62WjWaDY4Mf/AHVqLrjlpd2kYKUc1pI1tYWeBQJJ4Tk0jgfmoonGfKgOki1l47Cskt1SEcWnyUUQYBJJ+2DxaSkpo3HEdGeRCiizW4VIk9yPvUUUWW3/2Q=="
          },
          "features": [
              {
                  "type": "LABEL_DETECTION"
              }
          ]
      }
  ]
}

// var postData = {
//   requests:[
//     {
//       image:{
//         source:{
//           imageUri:
//             "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
//         }
//         // content: encoded
//         // content: base64Image("./assets/Draw-a-Sailboat-Step-7-Version-2.jpg")
//         // content: "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"
//         // source:{
//         //   imageUri:
//         //     base64Image("./assets/googlelogo_color_272x92dp.png")
//         // }
//       },
//       features:[
//         {
//           type:"FACE_DETECTION",
//           maxResults:10
//         }
//       ]
//     }
//   ]
//  };

 var url = 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDswFUPlp3w13sPavqPv62EfOAzye0--Fw'
 var options = {
  method: 'POST',
  body: postData,
  // headers: {
	// 	'content-type': 'application/json'
	// },
  agent: agent,
  json: true,
  url: url
 }




 /** search image POST method */
app.post('/searchImage', upload.single('uploadedImage'), function (req, response, next) {
  console.log("File received::" + req.file);
  // console.log("Request Body::"+req.body);

  // console.log("Request body is:: " + JSON.stringify(req.body));
  // console.log("file path is ::" + req.file.path);

  // Performs label detection on the image file
  // client
  //   .labelDetection(req.file.path)
  //   .then(results => {
  //     console.log("received results::"+results);
  //     const labels = results[0].labelAnnotations;

  //     console.log('Labels:');
  //     labels.forEach(label => console.log(label.description));
  //   })
  //   .catch(err => {
  //     console.error('ERROR:', err);
  //   });
  //   console.log("Service finished!!");

  request(options, function (err, res, body) {
    if (err) {
      console.error('error posting json: ', err)
      throw err
    }
    var headers = res.headers
    var statusCode = res.statusCode
    console.log('headers: ', headers)
    console.log('statusCode: ', statusCode)
    console.log('body: ', JSON.stringify(body));
    response.json(body);
    // console.log("Error received is "+JSON.stringify(body.responses[0].labelAnnotations))
   });

  // res.json({ message: 'Image received successfully' });
  // req.file is the `avatar` file 
  // req.body will hold the text fields, if there were any 
});

function base64Image(src) {
  var data = fs.readFileSync(src).toString('base64');
  console.log("Image = "+data);
  return data;
  // return util.format('data:%s;base64,%s', mime.lookup(src), data);
}

app.listen(port);

console.log('Image Search API server started on: ' + port);