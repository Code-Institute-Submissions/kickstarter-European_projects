# Kickstarter European Projects
 
This dashboard provides information on Kickstarter projects which have been launched between 2012 and January 2018.  If gives some insite into the success/failure rate and areas of interest per country and european region.


## Live Link 
The website is available for viewing via GitHub Pages on the following link: [Data Visualisation](https://ringhio79.github.io/frontend-project-2/)
 
## UX & Features
 
The data dashboard is designed to display correctly on screen width of 1024 and larger. Users accessing the site from devices with a smaller screen width are greeted with a modal warning to rever to a larger screen.  The dashboard is still visible on smaller screens however the layout is negatively affected.

Users are able to analyse the full data selection or filter down using any of the filters provided.  It is also possible to use the segments in the graphs to crossfilter the data in the other displayed graphs.  

A 'reset all' button is also available in the navbar for ease-of-use.

## Tech Used

### Some the tech used includes:
- D3, DC and Crossfilter
  - These JavaScript libraries were used to chart data, display graphs and apply crossfilters in this dashboard.
- HTML & CSS
    - to create layout and styling of front end
- [Bootstrap](http://getbootstrap.com/)
    - We use **Bootstrap** to give our project a simple, responsive layout
- [JQuery](https://jquery.com)
    - to create and customize responive features

## Testing
This dashboard has been tested manually.  The tests conducted are listed below:

1. Data display and responsiveness using [MobileTest.me](http://mobiletest.me/)
2. Modal visible on smaller screens and able to dismiss and continue to site
3. Tooltips working as expected
4. Crossfilter on charts working as expected
5. Responsive sidebar with filters working as expected 

## Local Deployment

This dashboard respository is available to clone from GigHub by following the steps below:

1. Copy the GitHub repository url by clicking on Clone or Download button
2. In your command line enter the command: ```git clone <url> ```
3. You may rename the directory of the repository that's been created.
4. The project is now available to run locally.

## Credits

### Information
- The dataset used in this project was obtained from [Kaggle.com](https://www.kaggle.com/)
- Sample graphs were viewed at [Richard Dalton DC examples](https://richardadalton.github.io/dcexamples/)
- Additional research for JavaScript tools from [stackoverflow](https://stackoverflow.com/)

### Acknowledgements
- Thank you to the mentors and teachers at Code Institute for the support and patience throughout this course.