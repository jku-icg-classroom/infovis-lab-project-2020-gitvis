# InfoVis Lab Project
Submission template for the InfoVis lab project at the Johannes Kepler University Linz.

**Explanation:**
This `README.md` needs to be pushed to Github for each of the 3 delivery dates.
For every submission change/extend the corresponding sections by replacing the [TODO] markers.
*In order to meet the deadlines make sure you push everything to your Github repository.*
For more details see [*Moodle page*](https://moodle.jku.at/jku/course/view.php?id=9291).

**Tip:** Make yourself familiar with [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).

# Submission due on 22.04.2020

## General Information

**Project Name:** GitVis

**Group Members**

| Student ID    | First Name  | Last Name      |
| --------------|-------------|----------------|
| [11714228]        | [Richard]      | [Wolfmayr]         |
| [11705011]        | [Michael]      | [Artner]         |
| [11776897]        | [Elias]      | [Burgstaller]         |

## Dataset

* What is the dataset about?
* Where did you get this dataset from (i.e., source of the dataset)?
* How was the dataset generated?
* What is dataset size in terms of nodes, items, rows, columns, ...?
* How is the dataset structured?

[The dataset is about the commits of the last few days of a git repository.
The data is retrieved by using the REST-API of git. https://developer.github.com/v3/
The dataset is generated by a tool we wrote ourselves. This tool uses the API to query all latest commits, 
then iterates over all those commits and queries more details like e.g. the detailes information about changed files.
This is put into JSON format and printed.
The size depends on how many commits have been done in the specified amount of days.
The maximum amount of REST-calls is limited to 60 for now, but we will probably be able to increase this.
For every commit there is a node and this node has several childnodes, best explained in this example:
```javascript
[
{
    "sha": "bc01300ead9f2cd59202b8737f75370428b615ec",
    "node_id": "MDY6Q29tbWl0NDk3MTcxMzpiYzAxMzAwZWFkOWYyY2Q1OTIwMmI4NzM3Zjc1MzcwNDI4YjYxNWVj",
    "commit": {
        "author": {
            "name": "Richard Wolfmayr",
            "email": "richard.wolfmayr@gmail.com",
            "date": "2020-04-03T11:58:16Z"
        },
        "committer": {
            "name": "Richard Wolfmayr",
            "email": "richard.wolfmayr@gmail.com",
            "date": "2020-04-03T11:58:16Z"
        },
        "message": "if free material creates an exaportitem, a new subjectcategory called \"free materials\" is created if it does not exist yet",
        "tree": {
            "sha": "48abd20c73bba6ee7c4e6afe933fd696b72949f4",
            "url": "https://api.github.com/repos/gtn/exacomp/git/trees/48abd20c73bba6ee7c4e6afe933fd696b72949f4"
        },
        "url": "https://api.github.com/repos/gtn/exacomp/git/commits/bc01300ead9f2cd59202b8737f75370428b615ec",
        "comment_count": 0,
        "verification": {
            "verified": false,
            "reason": "unsigned",
            "signature": null,
            "payload": null
        }
    },
    "url": "https://api.github.com/repos/gtn/exacomp/commits/bc01300ead9f2cd59202b8737f75370428b615ec",
    "html_url": "https://github.com/gtn/exacomp/commit/bc01300ead9f2cd59202b8737f75370428b615ec",
    "comments_url": "https://api.github.com/repos/gtn/exacomp/commits/bc01300ead9f2cd59202b8737f75370428b615ec/comments",
    "author": {
        "login": "richardwolfmayr",
        "id": 24298463,
        "node_id": "MDQ6VXNlcjI0Mjk4NDYz",
        "avatar_url": "https://avatars0.githubusercontent.com/u/24298463?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/richardwolfmayr",
        "html_url": "https://github.com/richardwolfmayr",
        "followers_url": "https://api.github.com/users/richardwolfmayr/followers",
        "following_url": "https://api.github.com/users/richardwolfmayr/following{/other_user}",
        "gists_url": "https://api.github.com/users/richardwolfmayr/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/richardwolfmayr/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/richardwolfmayr/subscriptions",
        "organizations_url": "https://api.github.com/users/richardwolfmayr/orgs",
        "repos_url": "https://api.github.com/users/richardwolfmayr/repos",
        "events_url": "https://api.github.com/users/richardwolfmayr/events{/privacy}",
        "received_events_url": "https://api.github.com/users/richardwolfmayr/received_events",
        "type": "User",
        "site_admin": false
    },
    "committer": {
        "login": "richardwolfmayr",
        "id": 24298463,
        "node_id": "MDQ6VXNlcjI0Mjk4NDYz",
        "avatar_url": "https://avatars0.githubusercontent.com/u/24298463?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/richardwolfmayr",
        "html_url": "https://github.com/richardwolfmayr",
        "followers_url": "https://api.github.com/users/richardwolfmayr/followers",
        "following_url": "https://api.github.com/users/richardwolfmayr/following{/other_user}",
        "gists_url": "https://api.github.com/users/richardwolfmayr/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/richardwolfmayr/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/richardwolfmayr/subscriptions",
        "organizations_url": "https://api.github.com/users/richardwolfmayr/orgs",
        "repos_url": "https://api.github.com/users/richardwolfmayr/repos",
        "events_url": "https://api.github.com/users/richardwolfmayr/events{/privacy}",
        "received_events_url": "https://api.github.com/users/richardwolfmayr/received_events",
        "type": "User",
        "site_admin": false
    },
    "parents": [
        {
            "sha": "5a7720a71de380566f956db14b5e9fd2d4b5043c",
            "url": "https://api.github.com/repos/gtn/exacomp/commits/5a7720a71de380566f956db14b5e9fd2d4b5043c",
            "html_url": "https://github.com/gtn/exacomp/commit/5a7720a71de380566f956db14b5e9fd2d4b5043c"
        }
    ],
    "stats": {
        "total": 20,
        "additions": 16,
        "deletions": 4
    },
    "files": [
        {
            "sha": "855f8bec6a2682cd889286cb9713ebd79d93aa79",
            "filename": "externallib.php",
            "status": "modified",
            "additions": 8,
            "deletions": 4,
            "changes": 12,
            "blob_url": "https://github.com/gtn/exacomp/blob/bc01300ead9f2cd59202b8737f75370428b615ec/externallib.php",
            "raw_url": "https://github.com/gtn/exacomp/raw/bc01300ead9f2cd59202b8737f75370428b615ec/externallib.php",
            "contents_url": "https://api.github.com/repos/gtn/exacomp/contents/externallib.php?ref=bc01300ead9f2cd59202b8737f75370428b615ec",
            "patch": null
        },
        {
            "sha": "a903a7ca9bf6e1c2404fd6036417008099edb430",
            "filename": "lang/de/block_exacomp.php",
            "status": "modified",
            "additions": 1,
            "deletions": 0,
            "changes": 1,
            "blob_url": "https://github.com/gtn/exacomp/blob/bc01300ead9f2cd59202b8737f75370428b615ec/lang/de/block_exacomp.php",
            "raw_url": "https://github.com/gtn/exacomp/raw/bc01300ead9f2cd59202b8737f75370428b615ec/lang/de/block_exacomp.php",
            "contents_url": "https://api.github.com/repos/gtn/exacomp/contents/lang/de/block_exacomp.php?ref=bc01300ead9f2cd59202b8737f75370428b615ec",
            "patch": null
        },
        {
            "sha": "83a187a0692373d47c4a01bf17e523ba0ef13280",
            "filename": "lang/en/block_exacomp.php",
            "status": "modified",
            "additions": 1,
            "deletions": 0,
            "changes": 1,
            "blob_url": "https://github.com/gtn/exacomp/blob/bc01300ead9f2cd59202b8737f75370428b615ec/lang/en/block_exacomp.php",
            "raw_url": "https://github.com/gtn/exacomp/raw/bc01300ead9f2cd59202b8737f75370428b615ec/lang/en/block_exacomp.php",
            "contents_url": "https://api.github.com/repos/gtn/exacomp/contents/lang/en/block_exacomp.php?ref=bc01300ead9f2cd59202b8737f75370428b615ec",
            "patch": null
        },
        {
            "sha": "6ef1aa2ca9ed8ae7b97e32a2619971e4b3a37214",
            "filename": "lang/total.php",
            "status": "modified",
            "additions": 6,
            "deletions": 0,
            "changes": 6,
            "blob_url": "https://github.com/gtn/exacomp/blob/bc01300ead9f2cd59202b8737f75370428b615ec/lang/total.php",
            "raw_url": "https://github.com/gtn/exacomp/raw/bc01300ead9f2cd59202b8737f75370428b615ec/lang/total.php",
            "contents_url": "https://api.github.com/repos/gtn/exacomp/contents/lang/total.php?ref=bc01300ead9f2cd59202b8737f75370428b615ec",
            "patch": null
        }
    ]
}
]
```

## User Tasks & Goals

* What are the user tasks?
* What would users like to see/get from the dataset?

[The user is a developer using git. 
-Which commit(s) possibly caused the bug?
-Which developer committed at what time?
-Who are the main contributors?
-What type of files are changed by which developer most frequently?]

# Submission due on 13.05.2020

## Proposed Dashboard Solution

* Which type of visualizations did you use?
* Explain why you chose these visualizations?
* Add sketches or images if possible

### Commit History Vis
For the visualization of the commithistory we used a graph, specifically a Directed Acyclic Graph. 
We decided to use a graph because the structure we get from Git is inherently a DAG already.
Each commit is represented by a node. Each node contains some textual information of this commit like title, author, date as well 
as two bars for deleted and inserted lines. The bars do not only show the ratio of deleted/inserted but the breadth of the bars
encodes the amount of lines changed overall. This way, the user can perceive which commit has a lot of lines changed and also 
comparing two commits can be done in an instant.

### Commit Detail Vis
At the top of the commit details view are textual details of the commit. This includes title/description, author and date of the commit. 
Also the number of additions and deletions is shown as bar graph (same data as in the node, but with two bars comparing is easier than with the stacked bars in the node).
Beneath this is a detailed section of the different file types. With a stacked the additions and deletions for each file type are visualized. The types are located on the y-axis so the width of the bars encodes the number of additions/deletions. To further 
differentiate between the bars, the types have different hues and the additions are slightly brighter than the deletions.

### Author Detail Vis
Visualizations that are being used:
- Image: for author avatar; trivial
- Text: for author name and link to github; trivial
- Pie-Chart: for # of commits (in total); easy to perceive the ratio of #commits_of_author / #commits_total
- Pie-Chart: for # of changes (in total; additions + deletions); easy to perceive the ratio of #changes_of_author / #changes_total where changes represents the #lines (additions + deletions) that have been changed
- Pie-Chart: for the ratio of additions and deletions (in total); easy to perceive if the author adds more than he deletes (or vice-versa)
- Pie-Chart: for the most often changed file types (in total); easy to perceive which file types are most often changed by the autor; because there may be many (>10) different file types that the author has changed, we need to aggregate the data; otherwise a pie-chart would not be suitable for visualizing this (>10 colors needed; many segments; bad)
- Calendar-Matrix: for the author´s commit history of the last 7 weeks; easy to perceive on which days the author commited and how much he commited on that day; design just like on github 

![Commit-Detail](img2.png)
![Author-Detail](img1.png)

# Submission due on 17.06.2020

## Implementation Details

* How did you implement the dashboard?
* Which external libraries and/or resources did you use?
* Additional information about the implementation

The dashboard is split into three main areas: header, history, details
The main.js is the core of the code where everything is initialized. The js code and the css-files for the actual visulizations of these areas are in three respective folders.

### Main:

Variables: 

- state: Contains all the globally needed variables like data, currently selected commit and author, selected date, etc.
- various constants

Functions:

- createVis: Appends the html elements for the three areas, calls the functions for creating the visualizations, update function.
- various small functions

### Header:

It shows a list of all authors that contributed to the repository. From this list the user can select an author to view more details about this authors contributions to the repository. The header also contains a dropdown list to switch between different datasets.  

### History:

The history is responsible for creating the datepicker and the interactive graph for the currently selected repository. The graph structure is rendered with dagreD3 which takes care of the layout. The inner HTML of the nodes showing overview information is created with pure d3.
The whole graph is draggable and zoomable. When a node is clicked, the details view is updated with the date of this node. With the datepicker the user can choose to only show part of the data.

Variables:
* a few variables for the HTML-elements, height and width, variable for storing zoom when reloading the graph
* the graph and the dagreD3-renderer

Functions:
* createHistoryVis: appends the elements to the history-div and initializes the dagre-d3 graph.
* updateHistoryVis: iterates over all commits and creates the visualization of the overview information for each node. Creates a node for each commit, adds it to the dagreD3 graph structure, and renders it.
* renderAfterDagreRender: small tweaks to the visualization inside the nodes after letting dagre-d3 do the rendering of the graph.
* renderLinesChanged: renders the stacked bar chart for every node.
* updateChartScales: updates the scale for the lineschanged bar chart.
* createDatePicker: gets the min and max date of the current dataset and creates a datepicker with these as preset values.
* renderHistoryGraphFromTo: renders only the correct nodes after datePicker has been used.
* formatDate: helper function for easier formatting of date.

### Details:

#### Commit details:

The commit details shows the presented information of the selected node in more details. It consists of three parts:
* at the top you can see author, date and title/description,
* in the middle you can see a bar chart showing the number of additions and deletions of the commit,
* and at the bottom you can see the number of additions and deletions for specific file types

Variables:
* axis, scales, groups etc. needed for the bar charts (2 sets, 1 for additions-deletions and 1 for file types)
* some constants like margin

Functions:
* createCommitDetailsVis: builds the html-structure for the three parts and initializes the visualization variables; it is split into 2 functions: 1 for additions-deletions and 1 for file types
* updateCommitDetails: parses the data into the needed format, updates scales and updates (enter, update, remove) the d3-presented data; again split into 2 functions

#### Repo details:

The repo details use the same visualizations as the commit details, but instead of a single commit it uses the data of the whole repository. Also there is no further description like author (there is no real author and we decided not to use the creator of the repository), title (already in the header) or date.

Variables:
* axis, scales, groups etc. needed for the bar charts (2 sets, 1 for additions-deletions and 1 for file types)
* some constants like margin

Functions:
* createRepoDetails: builds the html-structure for the two parts and initializes the visualization variables; it is split into 2 functions: 1 for additions-deletions and 1 for file types
* updateRepoDetails: parses the data into the needed format, updates scales and updates (enter, update, remove) the d3-presented data; again split into 2 functions
* showRepoDetails: contrary to commit details, repo details don't need to update everytime they are shown. Only at the beginning or if the repository is changed, the data needs to be updated so this function simply sets the display of the div to 'block' so it shows up.

Since commit details and repo details are so similar, there is an additional details_util.js that handles the following:
* sorting the file types so the type with the most changes (additions + deletions) is at the top
* aggregating some file types to an "others"-type if there are more than 10 different file types in the current data (commit or repository). This makes the bar chart easier to grasp and by hovering over "others" you can still see the additions and deletions of the file types that are in others. others are always at the bottom, regardless of the previous sorting.
* calculating the step size for the ticks on the x-axis of the bar charts



#### Author Details:
Creates and updates the author details for the currently selected author (if any). 
It uses primarily pie charts to visualize the respective data.
Additionally, it uses a tile map to visualize the author´s commit frequency in the last 20 weeks.  

Important methods: 
* updatePieChart: Updates the piechart with a given ID. 
First it uses the d3.pie() function to compute the startAngle and endAngle for each data item.
These angles are later used as data for visualizing the single piechart slices.
Each of these angle pairs will be visualized using d3.arc() which helps build arc shapes from these angles. 
Changes in the data are being animated, by interpolating between the old and new angle values, which gives a smooth piechart slice animation. Optionally, a tooltip text can be passed to this method which will be displayed when the user hovers over a piechart slice (in addition to the data value).
Optionally, a legend can be shown next to the piechart for the different data items. 
* updateCommitsChart: Processes the data such that for every author it collects how many commits he has made. 
Finally aggregates all other authors (i.e. all except the author whose details are being visualized) into an 'others' option.
* updateChangesChart: Processes the data such that for every author it collects how many changes he has made. 
Finally aggregates all other authors (i.e. all except the author whose details are being visualized) into an 'others' option.  
* updateFileTypesChart: Pre-processes the data and updates the pie chart. 
First it collects all the files that the author has commited to. For each of these files it extracts the filetype and stores for each filetype the number of occurances. Finally, if it´s more than five filetypes, it will take the four most frequently changed filetypes by the author and aggregate all other filetypes into an 'others' option. 
* updateCommitHistoryChart: Probably the most complicated method of all mentioned. First it pre-processes the data. 
It aggregates the authors commit data such that for every day it contains the number of commits for that author. Then it computes the intervall of days that should be visualized (spaning over 140 days). In order to properly visualize the single tiles (or cells) it stores the row and column in the tilemap in addition to the number of commits for that data item (i.e. day). 
Finally, based on these filtered, aggregated and mapped data items it updates the tilemap visualization and adds tooltips to show the exact number of commits for the tile (i.e. day) that is being hovered by the user.

### -getrepojson.html
This is a small tool for creating our datasets by using git-api. 
It gets the commits in a certain timeperiod, iterates over them and gets the details of which files have been changed how.

### Used libraries:
* jquery.js
* split.js
* dagreD3.js
* d3.js

## Limitations

* What are the limitations of your solution?
* Is there anything that a user could not achieve from the given user tasks? Why? What is missing and how must the prototype be improved?

[
* The most significant limitation is that the user cannot see which files have actually been changed, and what has been changed in those files.
So the user goal "Which commit(s) possibly caused the bug" is fulfilled, but the user has to use a different software, e.g. GitHub to actually FIND this bug. This is one thing that we would implement for sure if this would be developed further.
* Cannot compare authors directly: 
  In hindsight it would be very interesting to compare different authors side-by-side.
  This would make comparing authors much more easier. 
* The same filetype may have different colors in different charts: e.g. the .php might be blue in commit details and green in repo  details and red in author details. In order to solve this we would need a global color scale which supports every existing filetype of the repository - which could be far too many, which is why we haven't found a solution yet.
* The piecharts for lineschanged might be missleading. If a committer adds and deletes a huge file, e.g. a library, then this makes them look like a huge contributor.
]

## Findings and Insights

* How does the solution enable users to answer the tasks?
* What are the findings and insights from the dataset?

[
* Which developer committed at what time: This can be seen in the author details in the tilemap as well as in the history where a daterange can be selected.
* Which commit possibly caused the bug: This can be seen by taking a look at which files where changed in a commit. The user clicks a commit and then sees the filetype barcharts in the details.

* The dataset is less complex than we expected. Even more data would be useful, for example having deeper information about the changes in the files, not only "add" and "delete".]

## Conclusion

* What is your conclusion?

[Feedback from colleagues suggests that this visualization is mainly useful for exploration and entertainment, like comparing each others commit to lineschanged ratio. You can find out some interesting things about yourself and your fellow commiters, but not so much about bugs.

Future development could go more into the direction of gamification, e.g. having a highscore list for the authors who have the most lines added.]
