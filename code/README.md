# Structure

* **data** contains the dataset in CSV or JSON format
  * **sample.csv** contains an example dataset
* **src** contains the CSS and JavaScript of your implementation
  * **main.js** contains a small D3 example, which loads the CSV file and display it as a table
  * **style.css** contains the styles for the visualization
* **web_modules** contains external libraries (e.g., [D3](https://d3js.org))
* **index.html** entry point of the dashboard (see [below](#development-environment) how to run it)

You can replace the **sample.csv** and the **main.js** with your dashboard solution.

# Development environment

Recommendation:

* [Visual Studio Code](https://code.visualstudio.com/)
* [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension

## Run test server

* Open repository directory in VS Code
* Click *Go Live* in the status bar
* Open browser at http://localhost:5500/code/index.html

## Debugging

* Run test server (see above)
* Set breakpoint in JavaScript file
* Start debugging with **F5**
