# Tabular Content

HTML/CSS/JS application


### STEP 1:   Create Table Layout 
1.  Create a table with 11 rows and 8 column.

    The headings of column includes:  
    
    **Student Name, Student ID, Assignment 1, Assignment 2,...., Assignment 5, Average(%)**

    The table row contain **10 hypothetical students**.

2.  Create a function to generate **random Name** and **ramdom ID** for students.

    The Student name and ID of the first initialized 10 students should be saved.

3.  Headings:   **Dark Grey** BackGround-Color

    Cells:   **Alternating light-grey** BackGround-Color, **black** Text Color

4.  All data in Table:   **sans-serif** Font.

5.  Heading: **center-aligned**

    Name and ID: **left-aligned**

    Average: **right-aligned**    

6.  Only Assigment:  **content-editable**

        a) Not submitted ~ Default Value [-]: center-aligned -> Yellow BackGround-Color
        b) Submitted Integer 0-100 : right-aligned -> Alternating Row BackGround-Color
        c) Submitted invalid content: Converts to Default Value [-]

7.  *[Extra]* Click Student Name -> Highlight complete table data row

        Click Student Name again -> Disselect the Row
        Not allowed to Click Table Title Row!

8.  *[Extra]* Click Assignment Column Title -> Highlight complete Assignment Grade Column

        Click Assignment Colum Title -> Disselect the Column
        Not allowed to Select Student Name and Student ID


### STEP 2:   Calculate the Average Score [JS]
1.  Average Score: **Rounded Integer 0 - 100**, without decimal places. 

        Default Value -> **/**

    Update Average Score when:

        a) Input an Assignment Score.
        b) Delete an Assignment Column which has valid Score.
        c) Undelete an Assignment Column which has valid Score.
        d) Retrieve the Table saved before.

2.  Change CSS of the Average Score:

        Default Value: Black Color and alternating Row BackGround-Color.
        0 ≤ Score ≤ 59: White Color and Red BackGround-Color.
        60 ≤ Score ≤ 100: Black Color and alternating Row BackGround-Color.

3.  Click the Column of **Average** —> Toggle the presentation of Average Grade

    Sequence: a -> b -> c -> a -> b -> c -> ..............

        a) (Default) Average[%] - Percentage Grade - **93-100**
        b) Arerage[Letter] - Letter Grade - **A**
        c) Average[4.0] - 4.0 Scale - **4.0**

    **When the Assignment cell is changed/deleted/validated/invalidated/retrieved**     

    **the average Score should be updated to the current Format as well!**
 

### STEP 3:   Insert/Delete/Undelete the Row/Column 
**Row** - Student Information

**Column** - Assignment Score

1.  Make a button to insert a new Row at the buttom of the table(**below last Row**). 

2.  *[Extra]* Right Click on any cell in a Row -> Show an Menu with 2 options

        a) Insert a row above
        b) Insert a row below

     The **inserted new Row** should have the **same function** as previous Rows:

        a) Left Click Student Name -> Select the Row
        b) Right Click any place in Row -> Call the Contect Menu

3.  Make a button to insert a new Column at **one column left of Average[%] Column**.

    The title name is determined by the number of previous Assignments.

    [Format]  **`Assignment (count+1)`**

    For example, if there is `Assignment 1, Assignment 2, ... Assignment 5` in the table before,

    the title name of new inserted Column should be `Assignment 6`!

4.  *[Extra]* Make a button to **Delete Selected Row**.

5.  *[Extra]* Make a button to **Delete Selected Column**.

        Remember to update Final Grade Average

6.  *[Extra]* Make a button to **undelete the last deleted Row/Column**.

        Once clicked, button disabled!

        Until another Row/Column is deleted, button can be clicked again.
        
        Undelect a selected Column -> Update Final Grade Average

     Pay attention to restore these functions:

        a) Click the "Assginment X" Title -> Select the Column
        b) Validate Cells - Value + CSS
        c) Update Average Score



### STEP 4:   Save and Retrieve Table Information

1.  Create a button to **save all information of the current Table**.

2.  Create a button to **retrieve previously saved Table information.**

3.  Set a Div under the Table - [**Count of Unsubmitted** Assignments].

    Calculate the total value automatically when:

        a) Input an Assignment Score.
        b) A valid Assignment Score becomes invalid.
        c) Insert/Delete/Undelete/ a Row/Column.
        d) Retrieve previous saved table information.


### STEP 5:   Pay Attention when Insert/Delete/Undelete/Retrieve
1.  Generate **random Name** and **ramdom ID** for every inserted **Rows**.

2.  Update **Count of Unsubmitted** Assignments.

3.  Update the **Average Score** of Each Student when delete **Columns**, including toggle function.

4.  Add **Select** function in each inserted **Assginment Column**.

5.  Add **Select** function in each inserted **Student Row**.