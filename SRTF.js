const tableEl = document.querySelector("table")

let rows = 0;
let Processes = new Array();
let temp_processes = new Array();
let gantt_chart = new Array();
let c = 0;

function addRow(e){
    // e.preventDefault();
    const pid = document.getElementById("pid").value;
    const AT = document.getElementById("AT").value;
    const BT = document.getElementById("BT").value;

    // error message code -------------------------------
    let e1 = true;
    for(let i = 0; i<rows; i++){
        if (Processes[i][0] == pid){
            console.log("Process "+pid+" is already exist.");
            document.getElementById('e1').innerHTML="*Process "+pid+" is already exist.";
            e1 = false;
            break;
        }
    }

    if(e1){
        document.getElementById('e1').innerHTML="";
    }

    let e2 = true;
    if(isNaN(AT)){
        document.getElementById('e2').innerHTML="*Value must be a Number";
        e2 = false;
    }

    if(e2){
        document.getElementById('e2').innerHTML="";
    }

    let e3 = true;
    if(isNaN(BT)){
        document.getElementById('e3').innerHTML="*Value must be a Number";
        e3 = false;
    }

    if(e3){
        document.getElementById('e3').innerHTML="";
    }

    //--------------------------------------------------

    if(e1 && e2 && e3){   
        Processes[rows] = new Array(3);
        Processes[rows][0] = pid;
        Processes[rows][1] = parseInt(AT);
        Processes[rows][2] = parseInt(BT);

        temp_processes[rows] = new Array(3);
        temp_processes[rows][0] = pid;
        temp_processes[rows][1] = parseInt(AT);
        temp_processes[rows][2] = parseInt(BT);

        rows++;

        // adding a new row in table
        var table = document.getElementById('processTable').getElementsByTagName('tbody')[0];
        var newRow = table.insertRow(table.length);
        cell1 = newRow.insertCell(0);
        cell1.innerHTML = pid;
        cell1 = newRow.insertCell(1);
        cell1.innerHTML = AT;
        cell1 = newRow.insertCell(2);
        cell1.innerHTML = BT;
        cell1 = newRow.insertCell(3);
        cell1.innerHTML = `
            <td><button class="deleteRow" onClick="getdata(this)">Delete</button></td>
        `;
        
        // change the value of the fields
        document.getElementById("pid").value="";
        document.getElementById("AT").value="";
        document.getElementById("BT").value="";
    }

    error();
    console.table(Processes);
}

function getdata(td){
    selectedRow = td.parentElement.parentElement
    let t_pid = selectedRow.cells[0].innerHTML;
    
    for(let i = 0; i<Processes.length; i++){
        if(Processes[i][0] === t_pid){
            Processes.splice(i,1);
            rows--;
            break;
        }
    }

    console.table(Processes)
}

function onDeleteRow(e){
    if (!e.target.classList.contains('deleteRow')){
        return;
    }

    const btn = e.target;
    btn.closest("tr").remove();
}

function get_sum_BT(){
    let sum = 0;
    for(let i = 0; i<Processes.length; i++){
        sum += Processes[i][2];
    }

    return sum;
}

function error(){
    let e4 = true;
    if(Processes.length == 0){
        document.getElementById("e4").innerHTML = "*Please Enter a data before click on Calculate";
        e4 = false;
    }

    if(e4){
        document.getElementById("e4").innerHTML = "";
    }
}

function calculate(){
    
    let length = Processes.length;

    if(length != 0){
        let present_processes = new Array();
        let time = 0;
        
        // loop which run this loop to the complition

        while(get_sum_BT()){

            //logic for one div element

            // find a present processes
            for(let i = 0; i<length; i++){
                if (Processes[i][1] == time){
                    let index = present_processes.length;
                    present_processes[index] = new Array(3);
                    present_processes[index][0] = Processes[i][0];
                    present_processes[index][1] = Processes[i][1];
                    present_processes[index][2] = Processes[i][2];
                }
            }

            // present_processes.sort(comapare);

            console.log("Present Process");
            console.table(present_processes);
            // return;

            // console.log(present_processes);

            let t = gantt_chart.length
            // if there is a not any present process then set null in gantt chart otherwise go and execute the process
            if(present_processes.length != 0){

                // find the process with minimum burst time
                let idx = 0;
                let min = present_processes[idx][2];
                for(let i = 0; i<present_processes.length; i++){
                    if(present_processes[i][2] < min){
                        min = present_processes[i][2];
                        idx = i;
                    }
                }

                if(t == 0){
                    // if this is first process in gantt chart then perform this
                    gantt_chart[t] = new Array(2);
                    gantt_chart[t][0] = present_processes[idx][0];
                    gantt_chart[t][1] = time+1;
                }else if(present_processes[idx][0] == gantt_chart[(t)-1][0]){
                    // if newly comes process same as the previous one then do this
                    gantt_chart[t-1][1] = time+1;
                }else{
                    // if the newly comes process is different from previous one then do this
                    gantt_chart[t] = new Array(2);
                    gantt_chart[t][0] = present_processes[idx][0];
                    gantt_chart[t][1] = time+1;
                }

                present_processes[idx][2] -= 1;
                for(let i = 0; i<length; i++){
                    if(present_processes[idx][0] == Processes[i][0]){
                        Processes[i][2] -= 1;
                        break;
                    }
                }

                for(let i = 0; i<present_processes.length; i++){
                    if (present_processes[i][2] == 0){
                        present_processes.splice(i,1);
                        i--;
                    }
                }

            }else{
                // if there is not any process at present time then do this

                if(t == 0){
                    gantt_chart[t] = new Array(2);
                    gantt_chart[t][0] = "blank";
                    gantt_chart[t][1] = time+1;
                }else if(gantt_chart[t-1][0] == "blank"){
                    gantt_chart[t-1][1] = time+1;
                }else{
                    gantt_chart[t] = new Array(2);
                    gantt_chart[t][0] = "blank";
                    gantt_chart[t][1] = time+1;
                }
            }

            // increment time by one quantum till the process ends
            time = time + 1;
        }

        console.table(temp_processes);
        console.table(gantt_chart);   
        show_Gantt();
    }
}

function get_CT(p){
    for(let i = gantt_chart.length-1; i>=0; i--){
        if(gantt_chart[i][0] == p){
            return gantt_chart[i][1];
        }
    }
}

function add_css(cell){
    cell.style.backgroundColor="white";
    cell.style.border="1px solid black";
    cell.style.padding="6px";
}

function show_Gantt(){
    // var table = document.getElementById('gantt-chart').getElementsByTagName('tbody')[0];
    // var newRow = table.insertRow(-1);
    document.getElementById("start-message").innerHTML="Gantt Chart";
    var table = document.getElementById('gantt-chart').getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.length);
    
    for(let i = 0; i<gantt_chart.length+1; i++){
        cell1 = newRow.insertCell(i);

        if(i == 0){
            cell1.innerHTML = "";
            cell1.style.width="40px";
        }else{
            if(gantt_chart[i-1][0] == 'blank'){
                cell1.innerHTML = "";
            }else{
                cell1.innerHTML = gantt_chart[i-1][0];
            }
            cell1.style.width="40px";
            cell1.style.height="30px";
            cell1.style.backgroundColor="white";
            cell1.style.border="1px solid black";
        }
    }

    newRow = table.insertRow(table.length);
    for(let i = 0; i<gantt_chart.length+1; i++){
        cell1 = newRow.insertCell(i);

        if(i == 0){
            cell1.innerHTML = 0;
            cell1.style.textAlign="right";
            cell1.style.width="40px";
        }
        else{
            cell1.innerHTML = gantt_chart[i-1][1];
            cell1.style.width="40px";
            cell1.style.textAlign="right";
        }
    }
    
    document.getElementById("ans-table").innerHTML="Table";
    var ans_table = document.getElementById('process-table').getElementsByTagName('tbody')[0];
    var header = ans_table.insertRow(ans_table.length);
    var cell = header.insertCell(0);
    add_css(cell);
    cell.innerHTML = "Process";
    var cell = header.insertCell(1);
    add_css(cell);
    cell.innerHTML = "Arrival Time";
    var cell = header.insertCell(2);
    add_css(cell);
    cell.innerHTML = "Burst Time";
    var cell = header.insertCell(3);
    add_css(cell);
    cell.innerHTML = "Completion Time";
    var cell = header.insertCell(4);
    add_css(cell);
    cell.innerHTML = "Turn-around Time";
    var cell = header.insertCell(5);
    add_css(cell);
    cell.innerHTML = "Waiting Time";
    let t_tat = 0;
    let t_wt = 0;
    
    
    for(let i = 0;i<temp_processes.length; i++){
        var row = ans_table.insertRow(ans_table.length);
        var cell2 = row.insertCell(0);
        add_css(cell2);
        cell2.innerHTML = temp_processes[i][0];
        cell2 = row.insertCell(1);
        add_css(cell2);
        cell2.innerHTML = temp_processes[i][1];
        cell2 = row.insertCell(2);
        add_css(cell2);
        cell2.innerHTML = temp_processes[i][2];
        cell2 = row.insertCell(3);
        add_css(cell2);
        let ct = get_CT(temp_processes[i][0]);
        console.log(ct);
        cell2.innerHTML = ct;
        cell2 = row.insertCell(4);
        add_css(cell2);
        let tat = ct - temp_processes[i][1];
        cell2.innerHTML = tat;
        t_tat += tat;
        cell2 = row.insertCell(5);
        add_css(cell2);
        let wt = tat - temp_processes[i][2];
        t_wt += wt;
        cell2.innerHTML = wt;
    }

    var row = ans_table.insertRow(ans_table.length);
    var cell2 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var cell2 = row.insertCell(3);
    add_css(cell2);
    cell2.innerHTML = "Average";    
    cell2.style.columnSpan=4;
    var cell2 = row.insertCell(4);
    add_css(cell2);
    cell2.innerHTML = (t_tat/temp_processes.length).toPrecision(3);
    var cell2 = row.insertCell(5);
    add_css(cell2);
    cell2.innerHTML = (t_wt/temp_processes.length).toPrecision(3);
    var row = ans_table.insertRow(ans_table.length);
    var cell2 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var cell2 = row.insertCell(3);
    var cell2 = row.insertCell(4);
    var cell2 = row.insertCell(5);

    document.getElementById('calc').disabled = true;
    document.getElementById('addp').disabled = true;
    let arr = document.getElementsByClassName('deleteRow')
    for(let i = 0; i<arr.length; i++){
        arr[0].disabled = true;
    }

}

tableEl.addEventListener("click",onDeleteRow);