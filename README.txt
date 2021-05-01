This is currently a little side project of mine. It's a tool for Monster Hunter Rise and for personal use, but if you like it use it as well.
The idea: Make all armor combinations and save it in a database, so that i can search for skills in the database and it will give me all or most combinations that contains given skill.
How do i do this?
I made a mongoDb, where every head-Armor is in one collection, every body-Armor is in one and so on.
A little script will make all possible combinations of armor sets and saves it to the database.
Indexes will help to find the searched ones faster and last but not least an API will answer my calls over GET-Requests.
Example: <url>?skill=attackBoost will give me all combinations that contains the attackBoost skill. Armor that exceed the skill level won't be given to me.

Maybe i make a frontend for this that everyone can use, but i don't have much time so that will be delayed.