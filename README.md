## 2D Random Movement Simulator
This repository contains a minimal and prototypical web application for simulating the random movement of random points in a 2D space on a canvas. The application allows users to display distances between points, with different colors indicating the level of safety.
- green for okay distances;
- yellow for alerting distances;
- red for danger distances.

## Features

- Randomly generates a set of points within the canvas boundaries
- Displays the points as circles with labels on a canvas
- Calculates and displays distances between points
- Highlights points and distances based on safety thresholds
- Allows users to hide/show safety distances and distances between points
- Provides options to show only unsafe distances
- Allows users to start and stop point movement
- Updates summary and distances tables dynamically

## Demo
![Demo GIF](https://github.com/filippolauria/2d-random-movement-simulator/blob/main/demo.gif)

## Usage

1. Open the `simulator.html` file in a web browser.
2. Use the togglers to interact with the visualization:
   - **hide/show safety distances**: Hides or shows the safety distances between points.
   - **hide/show distances**: Hides or shows the distances between points.
   - **hide/show non-safe distances only**: Hides or shows only distances that are considered unsafe.
   - **start**: Starts moving the points randomly.
   - **stop**: Stops the movement of points.
3. The **coordinates summary** is a table that displays the current positions of the points.
4. The **distances matrix** shows the distances between points, with color coding to indicate safety.

## Customization

You can customize the following parameters in the JavaScript code (`script.js`):

- `canvasWidth`: Width of the canvas (default: 1024).
- `canvasHeight`: Height of the canvas (default: 768).
- `pointsNumber`: Number of points to generate (default: 10).
- `safetyDistance`: Safety distance threshold (default: 30).

## Acknowledgements

Special thanks to Abraham Gebrehiwot for his invaluable assistance and support throughout the development of this project.
His expertise and guidance greatly contributed to its success.

