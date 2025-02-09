/*
  Basic File I/O for displaying
  Skeleton Author: Joshua A. Levine
  Modified by: Amir Mohammad Esmaieeli Sikaroudi
  Email: amesmaieeli@email.arizona.edu
*/
/*
Modified further by: Ethan Gunn Wong
Email: egwong@arizona.edu
Modifications:
    added rotation functionality
    used an animate() function modularize code 
while there was a lot of code added, the part i believe 
Efrat cares about the most is the 3 matricies modifications 
(transformation toZer0) (rotational) (transformation back2origin)
*/

//access DOM elements we'll use
var input = document.getElementById("load_image");
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
// other vars/lets/consts which are vars in my mind
var width = 0;
var height = 0;
var ppm_img_data;
let currAngle = 0;
const ROTATION_SPEED = 1;

// no anti-aliasing
// if there is someone actually reading these comments
// know that i hate anti-aliasing because it makes enemies harder to see in video games
function animate() {
    // update curr angle 
    currAngle = (currAngle + ROTATION_SPEED) % 360;
    
    // Create a new image data object to hold the new image
    var newImageData = ctx.createImageData(width, height);
    

    // move to 0,0 (translation)
    // rotate (rotation)
    // move back to original (translation)
    // the math joke
    let toZer0 = GetTranslationMatrix(-width/2, -height/2); // move center to 0,0
    let rotation = GetRotationMatrix(currAngle);
    let back2origin = GetTranslationMatrix(width/2, height/2);
    
    // combine to one transformation
    // back2orign * rotation * toZer0
    let rotation_and_zer0 = MultiplyMatrixMatrix(rotation, toZer0);
    let finalTransform = MultiplyMatrixMatrix(back2origin, rotation_and_zer0);
    
    // apply finalTransformation to each pixel
    for (var i = 0; i < ppm_img_data.data.length; i += 4) {
        var pixel = [
            Math.floor(i / 4) % width,
            Math.floor(i / 4 / width),
            1
        ];
        
        // apply the finalTransformation
        var transformedPixel = MultiplyMatrixVector(finalTransform, pixel);
        
        // nearest pixel rounding
        transformedPixel[0] = Math.round(transformedPixel[0]);
        transformedPixel[1] = Math.round(transformedPixel[1]);
        
        // within bounds check
        // allowed "chopping" of edges, specified in spec
        if (transformedPixel[0] >= 0 && transformedPixel[0] < width &&
            transformedPixel[1] >= 0 && transformedPixel[1] < height) {
            
            let destOffset = i;
            let srcOffset = (transformedPixel[1] * width + transformedPixel[0]) * 4;
            
            newImageData.data[destOffset] = ppm_img_data.data[srcOffset];
            newImageData.data[destOffset + 1] = ppm_img_data.data[srcOffset + 1];
            newImageData.data[destOffset + 2] = ppm_img_data.data[srcOffset + 2];
            newImageData.data[destOffset + 3] = 255;
        }
    }
    
    // Draw the new image
    ctx.putImageData(newImageData, canvas.width/2 - width/2, canvas.height/2 - height/2);
    
    // Show matrix
    showMatrix(finalTransform);
    
    // request
    requestAnimationFrame(animate);
}

var upload = function () {
    if (input.files.length > 0) {
        var file = input.files[0];
        console.log("You chose", file.name);
        if (file.type) console.log("It has type", file.type);
        var fReader = new FileReader();
        fReader.readAsBinaryString(file);

        fReader.onload = function(e) {
            var file_data = fReader.result;
            parsePPM(file_data);
            
            // set currAngle
            // animate
            currAngle = 0;
            animate();
        }
    }
}

// Show transformation matrix on HTML
function showMatrix(matrix){
    for(let i=0;i<matrix.length;i++){
        for(let j=0;j<matrix[i].length;j++){
            matrix[i][j]=Math.floor((matrix[i][j]*100))/100;
        }
    }
    document.getElementById("row1").innerHTML = "row 1:[ " + matrix[0].toString().replaceAll(",",",\t") + " ]";
    document.getElementById("row2").innerHTML = "row 2:[ " + matrix[1].toString().replaceAll(",",",\t") + " ]";
    document.getElementById("row3").innerHTML = "row 3:[ " + matrix[2].toString().replaceAll(",",",\t") + " ]";
}

// Sets the color of a pixel in the new image data
function setPixelColor(newImageData, samplePixel, i){
    var offset = ((samplePixel[1] - 1) * width + samplePixel[0] - 1) * 4;

    // Set the new pixel color
    newImageData.data[i    ] = ppm_img_data.data[offset    ];
    newImageData.data[i + 1] = ppm_img_data.data[offset + 1];
    newImageData.data[i + 2] = ppm_img_data.data[offset + 2];
    newImageData.data[i + 3] = 255;
}

// Load PPM Image to Canvas
// Untouched from the original code
function parsePPM(file_data){
    /*
   * Extract header
   */
    var format = "";
    var max_v = 0;
    var lines = file_data.split(/#[^\n]*\s*|\s+/); // split text by whitespace or text following '#' ending with whitespace
    var counter = 0;
    // get attributes
    for(var i = 0; i < lines.length; i ++){
        if(lines[i].length == 0) {continue;} //in case, it gets nothing, just skip it
        if(counter == 0){
            format = lines[i];
        }else if(counter == 1){
            width = lines[i];
        }else if(counter == 2){
            height = lines[i];
        }else if(counter == 3){
            max_v = Number(lines[i]);
        }else if(counter > 3){
            break;
        }
        counter ++;
    }
    console.log("Format: " + format);
    console.log("Width: " + width);
    console.log("Height: " + height);
    console.log("Max Value: " + max_v);
    /*
     * Extract Pixel Data
     */
    var bytes = new Uint8Array(3 * width * height);  // i-th R pixel is at 3 * i; i-th G is at 3 * i + 1; etc.
    // i-th pixel is on Row i / width and on Column i % width
    // Raw data must be last 3 X W X H bytes of the image file
    var raw_data = file_data.substring(file_data.length - width * height * 3);
    for(var i = 0; i < width * height * 3; i ++){
        // convert raw data byte-by-byte
        bytes[i] = raw_data.charCodeAt(i);
    }
    // update width and height of canvas
    document.getElementById("canvas").setAttribute("width", window.innerWidth);
    document.getElementById("canvas").setAttribute("height", window.innerHeight);
    // create ImageData object
    var image_data = ctx.createImageData(width, height);
    // fill ImageData
    for(var i = 0; i < image_data.data.length; i+= 4){
        let pixel_pos = parseInt(i / 4);
        image_data.data[i + 0] = bytes[pixel_pos * 3 + 0]; // Red ~ i + 0
        image_data.data[i + 1] = bytes[pixel_pos * 3 + 1]; // Green ~ i + 1
        image_data.data[i + 2] = bytes[pixel_pos * 3 + 2]; // Blue ~ i + 2
        image_data.data[i + 3] = 255; // A channel is deafult to 255
    }
    ctx.putImageData(image_data, canvas.width/2 - width/2, canvas.height/2 - height/2);
    //ppm_img_data = ctx.getImageData(0, 0, canvas.width, canvas.height);   // This gives more than just the image I want??? I think it grabs white space from top left?
    ppm_img_data = image_data;
}

//Connect event listeners
input.addEventListener("change", upload);