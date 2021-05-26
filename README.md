# Introduction

We really appreciate your time to take this exercise. Do your best and we hope to hear from you soon! 

We need to connect with Trello's API to show in a web UI the Workplaces, Boards and Cards.

The rules are the following:

* FE: Use React or Vue as Framework.
* BE: Use node js.
* Keep the FE and BE separated, as two different projects.
* Don't use Trello's client library. Interact with Trello only thru the REST API.
* Don't expose Trello API keys in the front end.
* No mockup will be provided, you are totally free on the way you want to design this little application.
* Fork this project.
* Once you finished, send an email to: ivan.carrillo@freeagentsoftware.com and veronica.tunas@freeagentsoftware.com 
    * The email must contain a link to your github project.
    * Attach a video showing how your application works.
- Trello: https://trello.com/
- API Introduction: https://developer.atlassian.com/cloud/trello/guides/rest-api/api-introduction/
- API Reference: https://developer.atlassian.com/cloud/trello/rest/api-group-actions/

##  Instructions

* View 1:
    * This view must be used to login. Implement any authorization method, the result of the login must return the Trello Token and Key necessary to do requests to Trello's API.

* View 2:
    * Immediately after login:
      * There must be a dropdown to select the workspace (Organization)
      * Once the workspace is selected, a second dropdown must be enabled to select the board (Boards assigned to the selected workspace)
      * Once a board is selected, a grouped list must be created in the bottom with the list of cards
         *  The cards must be grouped by stage
         *  If the card contains activities, the activities must be listed (Must be clear to which card the activity belongs)
         *  The user must be able to Create/Update cards. 
            *  To create or update a card, the user must be able to at least fill the following information:
               *  Title
               *  Description
               *  Due Date
               *  Assign to multiple members
                  *  The UI must show the display name of the members not the ID's

* Notification:
    * If the user deletes a card, send an email notification (Don't include your email credentials in your project).
        * Send the email to any email you want.
        * Implement this step in the back end thru an API call.
        * In the email body add:
            * Type of Object deleted
            * Name / Description of the deleted object
            * User who deleted the object.
