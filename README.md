# Introduction

We really appreciate your time to take this exercise. Do your best and we hope to hear from you soon! 

We need to connect with Trello's API to show in a web UI the Workplaces, Boards and Cards.

The user must be able to CRUD the data, like for example, create a new card for a board, edit the name of a board or even delete a board with all its cards included.

The rules are the following:

* FE: Use React or Vue as Framework.
* BE: Use node js.
* Don't use Trello's client library. Interact with Trello only thru the REST API.
* Don't expose Trello API keys in the front end.
* No mockup will be provided, you are totally free on the way you want to design this little application.
* Fork this project.
* Once you finished, send an email to: ivan.carrillo@freeagentsoftware.com and veronica.tunas@freeagentsoftware.com 
    * The email must contain a link to your github project.
    * Attach a video showing how your application works.

Trello: https://trello.com/

##  Instructions

* View 1:
    * This view must be used to login. Implement any authorization method, the result of the login must return the Trello Token and Key necessary to do request to the API.
* View 2:
    * Immediately after login, the application must redirect to a list with all your Trello's workspaces (Organizations)
        * The user must be able to: Update / Create / Delete Organizations.
* View 3:
    * If the user selects a workspace, the application must redirect to another list with all boards assigned to that workspace.
        * This view must have a header, with the workspace name and workspace description. 
        * All CRUD methods must be implemented (Update / Create / Delete boards)
* View 4:
    * If the user selects a board, the application must redirect to a grouped list with all cards related to the board.
        * The cards must be grouped by stage.
        * This view must have a header with the board name. 
        * If a card has activities, list the activities list per each card.
            * Must be clear to which card the activity belongs.
        * To create or update a card, you need to at least being able to fill the following fields:
            * Title
            * Description
            * Due date
            * Assign multiple members
               * The UI must show the display name of the members not the IDs

* Notification:
    * If the user deletes any record, send an email notification (Don't include your email credentials in your project).
        * Send the email to any email you want.
        * Implement this step in the back end thru an API call.
        * In the email body add:
            * Type of Object deleted
            * Name / Description of the deleted object
            * User who deleted the object.
