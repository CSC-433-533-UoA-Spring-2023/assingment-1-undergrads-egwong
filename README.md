Author: {Ethan Wong} [{egwong@arizona.edu}]  
Course: CSc433
Date: [Feb]. [9], 2025


**Executing program:**
* cd into the directory containing index.html
* on mac: execute the command "open index.html"
* click on the "Browse..." button and select a ppm file {pic1.ppm or bunny.ppm}
* the selected ppm should be displayed on your screen rotating counterclockwise

**Description:**
This file is designed to intake a ppm file of the user's choosing {pic1.ppm or bunny.ppm} and rotate it in a counterclockwise direction. 
It does this using 3 matrix transformations:
* a translation function to send the center of the ppm to 0,0
* a rotation function to rotate the ppm around the center (0,0)
* a translation function to send the center of the ppm back to the center of the canvas


**Included files:**
* index.html    -- an html file with a canvas
* a01.js        -- a javascript file for functionality with the image uploading, a method to parse PPM images, and ppm rotating functionality
* MathUtilities.js		-- some math functions that you can use and extend yourself. It contains matrix manipulations
* bunny.ppm     -- a test image
* pic1.ppm      -- a pmm of my choosing, it is a frog sketch
* READEME.md    -- this

**PLEASE PROVIDE ANY ATTRIBUTION HERE**
* Images obtained from the following sources:
  * bunny: http://graphics.stanford.edu/data/3Dscanrep/  
  * pic1 (frog): https://www.pinterest.com/pin/422281207681860/
* Image conversion to ppm: https://imagemagick.org/index.php